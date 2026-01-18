const Music = require('../models/Music');

// @desc    Get all music
// @route   GET /api/music
// @access  Public
exports.getAllMusic = async (req, res) => {
  try {
    const { genre, language, search, page = 1, limit = 20 } = req.query;
    
    let query = {};
    
    // Filter by genre if provided
    if (genre && genre !== 'all') {
      query.genres = genre;
    }
    
    // Filter by language if provided
    if (language && language !== 'all') {
      query.language = language;
    }
    
    // Filter by artist if provided
    if (req.query.artist && req.query.artist !== 'all') {
      query.artist = req.query.artist;
    }
    
    // Search by title or artist
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { artist: { $regex: search, $options: 'i' } }
      ];
    }
    
    const music = await Music.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();
    
    const count = await Music.countDocuments(query);
    
    res.status(200).json({
      success: true,
      data: music,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      total: count
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching music',
      error: error.message
    });
  }
};

// @desc    Get single music by ID
// @route   GET /api/music/:id
// @access  Public
exports.getMusicById = async (req, res) => {
  try {
    const music = await Music.findById(req.params.id);
    
    if (!music) {
      return res.status(404).json({
        success: false,
        message: 'Music not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: music
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching music',
      error: error.message
    });
  }
};

// @desc    Get all unique genres
// @route   GET /api/music/genres
// @access  Public
exports.getGenres = async (req, res) => {
  try {
    const genres = await Music.distinct('genres');
    
    res.status(200).json({
      success: true,
      data: genres.sort()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching genres',
      error: error.message
    });
  }
};

// @desc    Get all unique languages
// @route   GET /api/music/languages
// @access  Public
exports.getLanguages = async (req, res) => {
  try {
    const languages = await Music.distinct('language');
    
    // Filter out null, undefined, and empty strings
    const validLanguages = languages.filter(lang => lang && lang.trim() !== '');
    
    res.status(200).json({
      success: true,
      data: validLanguages.sort()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching languages',
      error: error.message
    });
  }
};

// @desc    Get all unique artists
// @route   GET /api/music/artists
// @access  Public
exports.getArtists = async (req, res) => {
  try {
    const artists = await Music.distinct('artist');
    
    // Filter out null, undefined, and empty strings
    const validArtists = artists.filter(artist => artist && artist.trim() !== '');
    
    res.status(200).json({
      success: true,
      data: validArtists.sort()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching artists',
      error: error.message
    });
  }
};

// @desc    Upvote a music track
// @route   POST /api/music/:id/upvote
// @access  Public
exports.upvoteMusic = async (req, res) => {
  try {
    const music = await Music.findByIdAndUpdate(
      req.params.id,
      { $inc: { upvotes: 1 } },
      { new: true }
    );

    if (!music) {
      return res.status(404).json({
        success: false,
        message: 'Music not found'
      });
    }

    res.status(200).json({
      success: true,
      data: {
        upvotes: music.upvotes,
        downvotes: music.downvotes
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error upvoting music',
      error: error.message
    });
  }
};

// @desc    Downvote a music track
// @route   POST /api/music/:id/downvote
// @access  Public
exports.downvoteMusic = async (req, res) => {
  try {
    const music = await Music.findByIdAndUpdate(
      req.params.id,
      { $inc: { downvotes: 1 } },
      { new: true }
    );

    if (!music) {
      return res.status(404).json({
        success: false,
        message: 'Music not found'
      });
    }

    res.status(200).json({
      success: true,
      data: {
        upvotes: music.upvotes,
        downvotes: music.downvotes
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error downvoting music',
      error: error.message
    });
  }
};
