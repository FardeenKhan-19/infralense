import express from 'express';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import { PrismaClient } from '@prisma/client';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { authenticate, AuthRequest } from '../middleware/auth';
import axios from 'axios';
import fs from 'fs';
import path from 'path';

const router = express.Router();
const prisma = new PrismaClient();

const hasCloudinary = process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY;

if (hasCloudinary) {
    cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET
    });
}

const storage = hasCloudinary ? new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'infralense_complaints',
        allowed_formats: ['jpg', 'png', 'jpeg'],
    } as any,
}) : multer.diskStorage({
    destination: (req, file, cb) => {
        const dir = path.join(__dirname, '../../uploads');
        if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
        cb(null, dir);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage: storage });

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

router.post(
    '/',
    authenticate,
    upload.single('image'),
    async (req: AuthRequest, res: any) => {
        try {
            if (!req.file) {
                return res.status(400).json({ error: 'Image file is required' });
            }

            const imageUrl = hasCloudinary ? req.file.path : `/uploads/${req.file.filename}`;
            const { description, latitude, longitude } = req.body;

            if (!latitude || !longitude) {
                return res.status(400).json({ error: 'Coordinates are required' });
            }

            let base64Data;
            let mimeType = req.file.mimetype;

            if (hasCloudinary) {
                const imageResp = await axios.get(req.file.path, { responseType: 'arraybuffer' });
                mimeType = imageResp.headers['content-type'] || 'image/jpeg';
                base64Data = Buffer.from(imageResp.data, 'binary').toString('base64');
            } else {
                base64Data = fs.readFileSync(req.file.path, 'base64');
            }

            const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

            const prompt = `
        Analyze this image of an infrastructure issue (e.g., pothole, broken streetlight).
        Return purely a JSON object with:
        - "severityScore": an integer from 1 to 10 evaluating the damage severity.
        - "category": a short string categorizing the issue (e.g., "Pothole", "Streetlight", "Road Damage", "Water Leak").
        Do not include markdown blocks or any other text, just the raw JSON.
      `;

            const result = await model.generateContent([
                prompt,
                {
                    inlineData: {
                        data: base64Data,
                        mimeType,
                    },
                },
            ]);

            const responseText = result.response.text();
            let aiResult;
            try {
                // Strip out potential markdown code block formatting to be safe
                const jsonStr = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
                aiResult = JSON.parse(jsonStr);
            } catch (err) {
                console.error('Failed to parse Gemini response:', responseText);
                aiResult = { severityScore: 5, category: 'Uncategorized' }; // Fallback
            }

            const complaint = await prisma.complaint.create({
                data: {
                    imageUrl,
                    description: description || '',
                    latitude: parseFloat(latitude),
                    longitude: parseFloat(longitude),
                    severity: aiResult.severityScore,
                    category: aiResult.category,
                    status: 'PENDING',
                    creatorId: req.user!.userId,
                },
            });

            res.status(201).json(complaint);
        } catch (error: any) {
            console.error('Complaint submission error:', error);
            res.status(500).json({ error: 'Failed to submit complaint', details: error.message });
        }
    }
);

router.get('/', authenticate, async (req: AuthRequest, res: any) => {
    try {
        const complaints = await prisma.complaint.findMany({
            include: {
                creator: {
                    select: { name: true, email: true },
                },
            },
            orderBy: { createdAt: 'desc' },
        });
        res.json(complaints);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch complaints' });
    }
});

router.patch('/:id/status', authenticate, async (req: AuthRequest, res: any) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        if (!['APPROVED', 'REJECTED', 'RESOLVED'].includes(status)) {
            return res.status(400).json({ error: 'Invalid status' });
        }

        const complaint = await prisma.complaint.update({
            where: { id },
            data: { status },
        });

        res.json(complaint);
    } catch (error) {
        console.error("🔥 CRASH DETAILS:", error instanceof Error ? error.message : error);
        console.error(error); // This prints the full stack trace
        res.status(500).json({ error: error instanceof Error ? error.message : "Internal Server Error" });
    }
});

export default router;
