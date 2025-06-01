const express = require('express');
const axios = require('axios');
const fs = require('fs');
const csv = require('csv-parser');
const router = express.Router();
const path = require('path');

const FILE_ID = '1_Hb4LcDNw4w9Gp8d2Xmpkw8GqVE00A3O';
const csvUrl = `https://drive.google.com/uc?export=download&id=${FILE_ID}`;

router.get('/top-books', async (req, res) => {
  const results = [];
  try {
    const response = await axios.get(csvUrl, { responseType: 'stream' });
    response.data
      .pipe(csv())
      .on('data', (data) => results.push(data))
      .on('end', () => {
        results.sort((a, b) => parseFloat(b.currentScore) - parseFloat(a.currentScore));
        const top10 = results.slice(0, 10); // Top 10 books
        res.json(top10);
      });
  } catch (error) {
    console.error('Error fetching CSV:', error);
    res.status(500).json({ message: 'Failed to fetch CSV data' });
  }
});

module.exports = router;