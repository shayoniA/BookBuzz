const express = require('express');
const fs = require('fs');
const csv = require('csv-parser');
const router = express.Router();

router.get('/top-books', (req, res) => {
  const results = [];
  fs.createReadStream('AllBooks.csv')
    .pipe(csv())
    .on('data', (data) => results.push(data))
    .on('end', () => {
      results.sort((a, b) => parseFloat(b.currentScore) - parseFloat(a.currentScore));
      const top10 = results.slice(0, 10);  // Top 10 books
      res.json(top10);
    });
});

module.exports = router;