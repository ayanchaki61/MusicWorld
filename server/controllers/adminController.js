const Music = require('../models/Music');
const path = require('path');
const fs = require('fs').promises;

// @desc    Add new music
// @route   POST /api/admin/music
// @access  Private/Admin
exports.addMusic = async (req, res) => {
  try {
    const { title, artist, album, genres, language, duration, releaseDate, filePath: urlPath } = req.body;
    
    // Use uploaded file path or provided URL
    let filePath = urlPath;
    let coverArt = null;
    
    if (req.files) {
      if (req.files.musicFile) {
        filePath = '/uploads/music/' + req.files.musicFile[0].filename;
      }
      if (req.files.coverFile) {
        coverArt = '/uploads/covers/' + req.files.coverFile[0].filename;
      }
    }
    
    if (!filePath) {
      return res.status(400).json({
        success: false,
        message: 'Please provide music file or URL'
      });
    }
    
    const musicData = {
      title,
      artist,
      album,
      genres: Array.isArray(genres) ? genres : [genres],
      language: language || 'English',
      duration: Number(duration),
      filePath,
      coverArt,
      releaseDate,
      addedBy: req.user._id
    };
    
    const music = await Music.create(musicData);
    
    res.status(201).json({
      success: true,
      data: music,
      message: 'Music added successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error adding music',
      error: error.message
    });
  }
};

// @desc    Update music
// @route   PUT /api/admin/music/:id
// @access  Private/Admin
exports.updateMusic = async (req, res) => {
  try {
    let music = await Music.findById(req.params.id);
    
    if (!music) {
      return res.status(404).json({
        success: false,
        message: 'Music not found'
      });
    }
    
    const { title, artist, album, genres, language, duration, releaseDate } = req.body;
    
    const updateData = {
      title: title || music.title,
      artist: artist || music.artist,
      album: album || music.album,
      genres: genres ? (Array.isArray(genres) ? genres : [genres]) : music.genres,
      language: language || music.language,
      duration: duration ? Number(duration) : music.duration,
      releaseDate: releaseDate || music.releaseDate
    };
    
    // Handle new cover art upload
    if (req.file) {
      updateData.coverArt = '/uploads/covers/' + req.file.filename;
    }
    
    music = await Music.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true
    });
    
    res.status(200).json({
      success: true,
      data: music,
      message: 'Music updated successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating music',
      error: error.message
    });
  }
};

// @desc    Delete music
// @route   DELETE /api/admin/music/:id
// @access  Private/Admin
exports.deleteMusic = async (req, res) => {
  try {
    const music = await Music.findById(req.params.id);
    
    if (!music) {
      return res.status(404).json({
        success: false,
        message: 'Music not found'
      });
    }
    
    // Delete associated files if they're local
    if (music.filePath && music.filePath.startsWith('/uploads/')) {
      try {
        await fs.unlink(path.join(__dirname, '..', music.filePath));
      } catch (err) {
        console.error('Error deleting music file:', err);
      }
    }
    
    if (music.coverArt && music.coverArt.startsWith('/uploads/')) {
      try {
        await fs.unlink(path.join(__dirname, '..', music.coverArt));
      } catch (err) {
        console.error('Error deleting cover file:', err);
      }
    }
    
    await Music.findByIdAndDelete(req.params.id);
    
    res.status(200).json({
      success: true,
      message: 'Music deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting music',
      error: error.message
    });
  }
};
