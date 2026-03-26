import { Router } from 'express';
import { generateRecommendation } from '../services/gemini';

const router = Router();

// Proactive recommendation based on current system-wide metrics
router.get('/proactive', async (req, res) => {
  try {
    // In a real app, this would query the DB for the most "critical" areas
    const mockState = {
      trendingHotspots: ['Lagos Southwest', 'Nairobi East'],
      globalSeverity: 0.68,
      recentPetitions: 12
    };

    const recommendation = await generateRecommendation(mockState);
    res.json({ recommendation });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch recommendation' });
  }
});

export default router;
