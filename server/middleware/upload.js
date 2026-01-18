const multer = require('multer');
const path = require('path');

// Storage configuration for music files
const musicStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, process.env.UPLOAD_PATH || './uploads/music');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'music-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// Storage configuration for cover images
const coverStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, process.env.COVER_PATH || './uploads/covers');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'cover-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// File filter for audio files
const audioFileFilter = (req, file, cb) => {
  const allowedTypes = /mp3|wav|ogg|m4a|mpeg|audio/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  // Accept if either extension or mimetype matches
  if (extname || mimetype || file.mimetype.startsWith('audio/')) {
    return cb(null, true);
  } else {
    cb(new Error('Only audio files (MP3, WAV, OGG, M4A) are allowed! Got: ' + file.mimetype));
  }
};

// File filter for image files
const imageFileFilter = (req, file, cb) => {
  const allowedTypes = /jpg|jpeg|png|webp/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  // Accept if either extension or mimetype matches, or if it's an image mime type
  if (extname || mimetype || file.mimetype.startsWith('image/')) {
    return cb(null, true);
  } else {
    cb(new Error('Only image files (JPG, PNG, WEBP) are allowed! Got: ' + file.mimetype));
  }
};

// Combined file filter that routes files based on field name
const combinedFileFilter = (req, file, cb) => {
  if (file.fieldname === 'musicFile') {
    // Apply audio filter
    const allowedTypes = /mp3|wav|ogg|m4a|mpeg|audio/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (extname || mimetype || file.mimetype.startsWith('audio/')) {
      return cb(null, true);
    } else {
      return cb(new Error('Only audio files (MP3, WAV, OGG, M4A) are allowed! Got: ' + file.mimetype));
    }
  } else if (file.fieldname === 'coverFile') {
    // Apply image filter
    const allowedTypes = /jpg|jpeg|png|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (extname || mimetype || file.mimetype.startsWith('image/')) {
      return cb(null, true);
    } else {
      return cb(new Error('Only image files (JPG, PNG, WEBP) are allowed! Got: ' + file.mimetype));
    }
  } else {
    return cb(new Error('Unexpected field name: ' + file.fieldname));
  }
};

// Combined storage that routes files to correct directory
const combinedStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.fieldname === 'musicFile') {
      cb(null, process.env.UPLOAD_PATH || './uploads/music');
    } else if (file.fieldname === 'coverFile') {
      cb(null, process.env.COVER_PATH || './uploads/covers');
    } else {
      cb(new Error('Unexpected field name: ' + file.fieldname));
    }
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    if (file.fieldname === 'musicFile') {
      cb(null, 'music-' + uniqueSuffix + path.extname(file.originalname));
    } else if (file.fieldname === 'coverFile') {
      cb(null, 'cover-' + uniqueSuffix + path.extname(file.originalname));
    } else {
      cb(new Error('Unexpected field name: ' + file.fieldname));
    }
  }
});

// Multer upload instances
const uploadMusic = multer({
  storage: musicStorage,
  fileFilter: audioFileFilter,
  limits: { fileSize: 50 * 1024 * 1024 } // 50MB limit
});

const uploadCover = multer({
  storage: coverStorage,
  fileFilter: imageFileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

// Combined upload for both music and cover files
const uploadMusicWithCover = multer({
  storage: combinedStorage,
  fileFilter: combinedFileFilter,
  limits: { fileSize: 50 * 1024 * 1024 } // 50MB limit for largest file
});

module.exports = { uploadMusic, uploadCover, uploadMusicWithCover };
