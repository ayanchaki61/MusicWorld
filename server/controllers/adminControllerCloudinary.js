const Music = require('../models/Music');
const cloudinary = require('../config/cloudinary');
const streamifier = require('streamifier');

// Helper function to upload file to Cloudinary
const uploadToCloudinary = (fileBuffer, folder, resourceType = 'auto') => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: `musicworld/${folder}`,
        resource_type: resourceType
      },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );
    streamifier.createReadStream(fileBuffer).pipe(uploadStream);
  });
};

// @desc    Add new music
// @route   POST /api/admin/music
// @access  Private/Admin
exports.addMusic = async (req, res) => {
  try {
    const { title, artist, album, genres, language, duration, releaseDate, filePath: urlPath } = req.body;
    
    let filePath = urlPath;
    let coverArt = null;
    
    // Upload files to Cloudinary if provided
    if (req.files) {
      if (req.files.musicFile && req.files.musicFile[0]) {
        const musicUpload = await uploadToCloudinary(
          req.files.musicFile[0].buffer,
          'music',
          'video' // Use 'video' for audio files in Cloudinary
        );
        filePath = musicUpload.secure_url;
      }
      
      if (req.files.coverFile && req.files.coverFile[0]) {
        const coverUpload = await uploadToCloudinary(
          req.files.coverFile[0].buffer,
          'covers',
          'image'
        );
        coverArt = coverUpload.secure_url;
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
    console.error('Add music error:', error);
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
    
    // Handle new cover art upload to Cloudinary
    if (req.file) {
      const coverUpload = await uploadToCloudinary(
        req.file.buffer,
        'covers',
        'image'
      );
      updateData.coverArt = coverUpload.secure_url;
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
    console.error('Update music error:', error);
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
    
    // Delete files from Cloudinary if they exist
    if (music.filePath && music.filePath.includes('cloudinary.com')) {
      try {
        const publicId = music.filePath.split('/').slice(-2).join('/').split('.')[0];
        await cloudinary.uploader.destroy(`musicworld/music/${publicId}`, { resource_type: 'video' });
      } catch (error) {
        console.error('Error deleting music file from Cloudinary:', error);
      }
    }
    
    if (music.coverArt && music.coverArt.includes('cloudinary.com')) {
      try {
        const publicId = music.coverArt.split('/').slice(-2).join('/').split('.')[0];
        await cloudinary.uploader.destroy(`musicworld/covers/${publicId}`);
      } catch (error) {
        console.error('Error deleting cover from Cloudinary:', error);
      }
    }
    
    await Music.findByIdAndDelete(req.params.id);
    
    res.status(200).json({
      success: true,
      message: 'Music deleted successfully'
    });
  } catch (error) {
    console.error('Delete music error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting music',
      error: error.message
    });
  }
};
