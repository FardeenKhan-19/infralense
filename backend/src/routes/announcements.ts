import { Router } from 'express';
import prisma from '../lib/db';
import { authenticate, AuthRequest } from '../middleware/auth';

const router = Router();

// Create announcement (Admin only)
router.post('/', authenticate, async (req: AuthRequest, res) => {
  try {
    if (req.user?.role !== 'ADMIN') return res.status(403).json({ error: 'Admin only' });
    const { title, content, priority } = req.body;
    const announcement = await prisma.announcement.create({
      data: { title, content, priority: priority || 'INFO' }
    });
    res.json(announcement);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create announcement' });
  }
});

// Get all announcements
router.get('/', authenticate, async (_req: AuthRequest, res) => {
  try {
    const announcements = await prisma.announcement.findMany({
      orderBy: { createdAt: 'desc' }
    });
    res.json(announcements);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch announcements' });
  }
});

export default router;
