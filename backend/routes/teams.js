const express = require('express');
const { 
  getAllTeams, 
  getTeamById, 
  createTeam, 
  updateTeam, 
  deleteTeam 
} = require('../controllers/teamController');
const { protect } = require('../middleware/auth');
const router = express.Router();

router.get('/', getAllTeams);
router.get('/:id', getTeamById);
router.post('/', protect, createTeam);
router.put('/:id', protect, updateTeam);
router.delete('/:id', protect, deleteTeam);

module.exports = router;