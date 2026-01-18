const express = require('express');
const router = express.Router();
const multer = require('multer');
const { protect, adminOnly } = require('../middleware/auth');
const {
  addMusic,
  updateMusic,
  deleteMusic
} = require('../controllers/adminControllerCloudinary');

// Configure multer to use memory storage for Cloudinary
const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 50 * 1024 * 1024 // 50MB limit
  }
});

// Protect all admin routes
router.use(protect);
router.use(adminOnly);

// Upload music with cover art
router.post('/music', upload.fields([
  { name: 'musicFile', maxCount: 1 },
  { name: 'coverFile', maxCount: 1 }
]), addMusic);

// Update music (cover art only)
router.put('/music/:id', upload.single('coverFile'), updateMusic);

// Delete music
router.delete('/music/:id', deleteMusic);

module.exports = router;
