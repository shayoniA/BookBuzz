const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/userRoutes');
const User = require('./models/User');
const topBooksRouter = require('./routes/topBooks');
const allBooksRouter = require('./routes/allBooks');
const insightsRouter = require('./routes/insights');
const fs = require('fs');
const csv = require('csv-parser');

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

app.use('/api', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api', topBooksRouter);
// app.use('/api', allBooksRouter);
app.use('/api/insights', insightsRouter);

// All Books Route (from CSV)
app.get('/api/all-books', (req, res) => {
  const results = [];
  fs.createReadStream('AllBooks.csv')
    .pipe(csv())
    .on('data', (data) => results.push(data))
    .on('end', () => {
      res.json(results);
    });
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