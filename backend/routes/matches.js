const express = require('express');
const {
  getMatches,
  createMatch,
  updateMatch,
  deleteMatch,
} = require('../controllers/matchController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.get('/', getMatches);
router.post('/', protect, createMatch);
router.patch('/:id', protect, updateMatch);
router.delete('/:id', protect, deleteMatch);

module.exports = router;

