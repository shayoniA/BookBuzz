const express = require('express');
const fs = require('fs');
const csv = require('csv-parser');
const router = express.Router();

router.get('/all-books', (req, res) => {
  const results = [];
  fs.createReadStream('AllBooks.csv')
    .pipe(csv())
    .on('data', (data) => results.push(data))
    .on('end', () => {
      res.json(results);
    });
});

module.exports = router;