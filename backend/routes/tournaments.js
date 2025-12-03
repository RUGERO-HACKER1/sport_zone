const express = require('express');
const {
  getAllTournaments,
  getTournamentById,
  createTournament,
  updateTournament,
  deleteTournament,
  registerForTournament,
} = require('../controllers/tournamentController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.get('/', getAllTournaments);
router.post('/', protect, createTournament);
router.post('/:id/register', protect, registerForTournament);
router.get('/:id', getTournamentById);
router.put('/:id', protect, updateTournament);
router.delete('/:id', protect, deleteTournament);

module.exports = router;