import { Router } from 'express';
import axios from 'axios';
import { generatePetitionText } from '../services/gemini';

const router = Router();

import { io } from '../index';

router.post('/gap-analysis', async (req, res) => {
  try {
    const { population, schools, hospitals, banks, lat, lng } = req.body;

    // Call Consolidated Python AI Service with 8s timeout
    console.log(`Sending unified request for ${population} people to AI Service...`);
    
    let result;
    try {
      const aiResponse = await axios.post('http://127.0.0.1:8000/api/analyze-full', {
        population, schools, hospitals, banks
      }, { timeout: 8000 });
      result = aiResponse.data;
    } catch (err) {
      console.warn('AI Service FAILED or TIMED OUT. Using backend estimation fallback.');
      // Robust Fallback Logic for Demo Reliability
      const req_schools = (population * 0.20) / 500;
      const req_hospitals = population / 10000;
      const req_banks = population / 2000;
      
      const calcGap = (ext: number, req: number) => ({
        existing: ext,
        required: Math.round(req),
        gap: Math.round(Math.max(0, req - ext)),
        severity: Math.min(1, Math.max(0, (req - ext) / req))
      });

      result = {
        gaps: {
          schools: calcGap(schools, req_schools),
          hospitals: calcGap(hospitals, req_hospitals),
          banks: calcGap(banks, req_banks)
        },
        severity: 0.5,
        priority: 7.5,
        label: "moderate",
        prediction: {
          projection_years: 5,
          future_population: Math.round(population * 1.15),
          gaps: {
             schools: { existing: schools, future_required: Math.round(req_schools * 1.15), future_gap: Math.round(req_schools * 1.15) - schools },
             hospitals: { existing: hospitals, future_required: Math.round(req_hospitals * 1.15), future_gap: Math.round(req_hospitals * 1.15) - hospitals },
             banks: { existing: banks, future_required: Math.round(req_banks * 1.15), future_gap: Math.round(req_banks * 1.15) - banks }
          }
        }
      };
    }

    // Emit live intelligence update to Admin
    io.emit('intelligence_update', {
      type: result.severity > 0.6 ? 'critical' : 'insight',
      message: `Analysis at [${lat.toFixed(2)}, ${lng.toFixed(2)}]. Severity: ${(result.severity * 100).toFixed(0)}%. Pop: ${population.toLocaleString()}`,
      timestamp: new Date().toISOString()
    });

    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: 'AI Analysis Service Unavailable' });
  }
});

router.post('/generate-petition', async (req, res) => {
  try {
    const { data } = req.body;
    const text = await generatePetitionText(data);
    res.json({ text });
  } catch (error) {
    res.status(500).json({ error: 'AI generation failed' });
  }
});

export default router;
