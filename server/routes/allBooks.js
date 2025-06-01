const express = require('express');
const fs = require('fs');
const csv = require('csv-parser');
const router = express.Router();
const path = require('path');

router.get('/all-books', (req, res) => {
  const results = [];
  const csvPath = path.join(__dirname, 'AllBooks.csv');
  fs.createReadStream(csvPath)
    .pipe(csv())
    .on('data', (data) => results.push(data))
    .on('end', () => {
      res.json(results);
    });
});

module.exports = router;