const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');

router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user) return res.status(400).json({ message: 'Invalid username or password!' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid username or password!' });

    return res.status(200).json({ message: 'Login successful!', username: user.username, userId: user._id });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
});

router.post('/google-login', async (req, res) => {
  const { email } = req.body;
  if (!email) {
    console.error('Email not provided in request body:', req.body);
    return res.status(400).json({ message: 'Email is required for Google login.' });
  }
  try {
    let user = await User.findOne({ username: email });
    if (!user) {
      user = new User({
        username: email,
        password: 'google_oauth_placeholder',
        favorites: [],
        createdAt: new Date()
      });
      await user.save();
    }
    res.json({ 
      message: 'Login successful', 
      userId: user._id, 
      username: user.username 
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/add-favorite', async (req, res) => {
  const { username, book } = req.body;
  console.log('Received book:', book);
  console.log('Received book username:', username);
  if (!username || !book || !book.book_title) {
    return res.status(400).json({ message: 'Invalid data.' });
  }
  try {
    const user = await User.findOne({ username });
    if (!user) return res.status(404).json({ message: 'User not found.' });

    if (user.favorites.some(fav => fav.book_title === book.book_title)) {
      return res.status(400).json({ message: 'Book already in favorites.' });
    }

    user.favorites.push({
      book_title: book.book_title,
      author: book.author,
      currentScore: book.currentScore,
      categories: book.categories,
      image: book.image || '',
      description: book.description || '',
    });
    await user.save();
    res.json({ message: 'Book added to favorites.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error.' });
  }
});

router.post('/remove-favorite', async (req, res) => {
  const { username, book_title } = req.body;
  if (!username || !book_title) {
    return res.status(400).json({ message: 'Invalid data.' });
  }
  try {
    const user = await User.findOne({ username });
    if (!user) return res.status(404).json({ message: 'User not found.' });
    user.favorites = user.favorites.filter(fav => fav.book_title !== book_title);
    await user.save();
    res.json({ message: 'Book removed from favorites.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error.' });
  }
});

router.get('/favorites/:username', async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username });
    if (!user) return res.status(404).json({ message: 'User not found.' });
    res.json(user.favorites);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error.' });
  }
});

module.exports = router;