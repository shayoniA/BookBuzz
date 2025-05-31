const express = require('express');
const router = express.Router();
const Insight = require('../models/Insight');

// Add a new insight
router.post('/add-insight', async (req, res) => {
  const { bookId, userId, username, content } = req.body;
  if (!bookId || !userId || !content) return res.status(400).json({ message: 'Missing fields' });

  try {
    const insight = new Insight({ bookId, userId, username, content });
    await insight.save();
    res.status(201).json({ message: 'Insight added', insight });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get insights for a book (sorted by upvotes)
router.get('/get-insights/:bookId', async (req, res) => {
  const { bookId } = req.params;
  try {
    const insights = await Insight.find({ bookId }).sort({ upvotes: -1, createdAt: -1 });
    res.json(insights);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Upvote an insight
router.post('/upvote', async (req, res) => {
  const { insightId, userId } = req.body;
  try {
    const insight = await Insight.findById(insightId);
    if (!insight) return res.status(404).json({ message: 'Insight not found' });
    if (insight.userId === userId) return res.status(400).json({ message: 'Cannot upvote your own insight' });
    if (insight.upvotedBy.includes(userId)) return res.status(400).json({ message: 'Already upvoted' });

    insight.upvotes += 1;
    insight.upvotedBy.push(userId);
    await insight.save();
    res.json({ message: 'Upvoted successfully', upvotes: insight.upvotes });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get recent insights for a specific user (latest per book)
router.get('/recent-insights/:userId', async (req, res) => {
  const { userId } = req.params;
  try {
    const allInsights = await Insight.find({ userId }).sort({ createdAt: -1 });
    // Create a Map to store latest insights per bookId
    const latestInsightsMap = new Map();
    // Iterate and only keep the latest insight per bookId
    for (const insight of allInsights) {
      if (!latestInsightsMap.has(insight.bookId))
        latestInsightsMap.set(insight.bookId, insight);
    }
    const uniqueRecentInsights = Array.from(latestInsightsMap.values()).slice(0, 5);
    res.json(uniqueRecentInsights);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;