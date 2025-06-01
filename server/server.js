const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/userRoutes');
const User = require('./models/User');
const topBooksRouter = require('./routes/topBooks');
const insightsRouter = require('./routes/insights');
const fs = require('fs');
const axios = require('axios');
const csv = require('csv-parser');
const { Readable } = require('stream');

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

app.use('/api', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api', topBooksRouter);
app.use('/api/insights', insightsRouter);

// app.get('/api/all-books', (req, res) => {
//   const results = [];
//   //fs.createReadStream('AllBooks.csv')
//   fs.createReadStream(path.join(__dirname, 'AllBooks.csv'))
//     .pipe(csv())
//     .on('data', (data) => results.push(data))
//     .on('end', () => {
//       res.json(results);
//     });
// });

// All Books Route (from CSV)
app.get('/api/all-books', async (req, res) => {
  const results = [];
  const FILE_ID = '1_Hb4LcDNw4w9Gp8d2Xmpkw8GqVE00A3O';
  const url = `https://drive.google.com/uc?export=download&id=${FILE_ID}`;
  try {
    const response = await axios.get(url, { responseType: 'stream' });
    response.data
      .pipe(csv())
      .on('data', (data) => results.push(data))
      .on('end', () => {
        res.json(results);
      });
  } catch (err) {
    console.error('Error fetching CSV:', err);
    res.status(500).json({ message: 'Failed to fetch CSV data' });
  }
});



app.get('/api/users/:userId/favorites', async (req, res) => {
  const userId = req.params.userId;
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user.favorites);
  } catch (error) {
    console.error('Error fetching favorites:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Serve static files from React
app.use(express.static(path.join(__dirname, '../bookbuzz/build')));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../bookbuzz/build', 'index.html'));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));