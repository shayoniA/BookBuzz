const mongoose = require('mongoose');

const insightSchema = new mongoose.Schema({
  bookId: { type: String, required: true },
  userId: { type: String, required: true },
  username: { type: String, required: true },
  content: { type: String, required: true, maxlength: 1000 },
  upvotes: { type: Number, default: 0 },
  upvotedBy: [{ type: String }],  // userIds who have upvoted
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Insight', insightSchema);