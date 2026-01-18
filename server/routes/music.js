const express = require('express');
const router = express.Router();
const {
  getAllMusic,
  getMusicById,
  getGenres,
  getLanguages,
  getArtists,
  upvoteMusic,
  downvoteMusic
} = require('../controllers/musicController');

router.get('/genres', getGenres);
router.get('/languages', getLanguages);
router.get('/artists', getArtists);
router.get('/', getAllMusic);
router.get('/:id', getMusicById);
router.post('/:id/upvote', upvoteMusic);
router.post('/:id/downvote', downvoteMusic);

module.exports = router;
