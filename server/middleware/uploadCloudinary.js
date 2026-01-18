const multer = require('multer');
const path = require('path');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinary');

// Cloudinary storage for music files
const musicCloudinaryStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'musicworld/music',
    resource_type: 'auto',
    allowed_formats: ['mp3', 'wav', 'ogg', 'm4a', 'mpeg'],
  }
});

// Cloudinary storage for cover images
const coverCloudinaryStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'musicworld/covers',
    resource_type: 'image',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
  }
});

// File filter for audio files
const audioFileFilter = (req, file, cb) => {
  const allowedTypes = /mp3|wav|ogg|m4a|mpeg|audio/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

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

  if (extname || mimetype || file.mimetype.startsWith('image/')) {
    return cb(null, true);
  } else {
    cb(new Error('Only image files (JPG, PNG, WEBP) are allowed! Got: ' + file.mimetype));
  }
};

// Combined file filter for both audio and image
const combinedFileFilter = (req, file, cb) => {
  const audioTypes = /mp3|wav|ogg|m4a|mpeg/;
  const imageTypes = /jpg|jpeg|png|webp/;
  const extname = path.extname(file.originalname).toLowerCase();
  
  const isAudio = audioTypes.test(extname) || file.mimetype.startsWith('audio/');
  const isImage = imageTypes.test(extname) || file.mimetype.startsWith('image/');
  
  if (isAudio || isImage) {
    return cb(null, true);
  } else {
    cb(new Error('Only audio and image files are allowed!'));
  }
};

// Upload middleware for music files with Cloudinary
const uploadMusic = multer({
  storage: musicCloudinaryStorage,
  fileFilter: audioFileFilter,
  limits: {
    fileSize: 50 * 1024 * 1024 // 50MB limit
  }
});

// Upload middleware for cover images with Cloudinary
const uploadCover = multer({
  storage: coverCloudinaryStorage,
  fileFilter: imageFileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

// Combined upload middleware with Cloudinary
const uploadMusicWithCover = multer({
  storage: multer.diskStorage({}), // Will handle files separately
  fileFilter: combinedFileFilter,
  limits: {
    fileSize: 50 * 1024 * 1024 // 50MB for music files
  }
});

module.exports = {
  uploadMusic,
  uploadCover,
  uploadMusicWithCover
};
