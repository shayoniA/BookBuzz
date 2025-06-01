const express = require('express');
const fs = require('fs');
const axios = require('axios');
const csv = require('csv-parser');
const router = express.Router();
const path = require('path');

const FILE_ID = '1_Hb4LcDNw4w9Gp8d2Xmpkw8GqVE00A3O';
const url = `https://drive.google.com/uc?export=download&id=${FILE_ID}`;

router.get('/all-books', async (req, res) => {
  const results = [];
  try {
    const response = await axios.get(url, { responseType: 'stream' });
    response.data
      .pipe(csv())
      .on('data', (data) => results.push(data))
      .on('end', () => {
        res.json(results);
      });
  } catch (error) {
    console.error('Error fetching CSV:', error);
    res.status(500).json({ message: 'Failed to fetch CSV data' });
  }
});

module.exports = router;