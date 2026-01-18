const mongoose = require('mongoose');

const musicSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide a music title'],
    trim: true
  },
  artist: {
    type: String,
    required: [true, 'Please provide an artist name'],
    trim: true
  },
  album: {
    type: String,
    trim: true
  },
  genres: [{
    type: String,
    required: true
  }],
  language: {
    type: String,
    trim: true,
    default: 'English'
  },
  duration: {
    type: Number,
    required: [true, 'Please provide music duration in seconds']
  },
  filePath: {
    type: String,
    required: [true, 'Please provide file path or URL']
  },
  coverArt: {
    type: String,
    default: '/uploads/covers/default.jpg'
  },
  releaseDate: {
    type: Date
  },
  upvotes: {
    type: Number,
    default: 0
  },
  downvotes: {
    type: Number,
    default: 0
  },
  addedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Index for faster genre filtering
musicSchema.index({ genres: 1 });
musicSchema.index({ language: 1 });
musicSchema.index({ artist: 1 });
musicSchema.index({ title: 1 });

module.exports = mongoose.model('Music', musicSchema);
