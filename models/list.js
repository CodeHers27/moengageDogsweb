const mongoose = require('mongoose');

const listSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  name: String,
  createdAt: { type: Date, default: Date.now },
  responseCodes: [String],
  imageUrls: [String]
});

module.exports = mongoose.model('List', listSchema);
