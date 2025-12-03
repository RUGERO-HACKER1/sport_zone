const { Tournament, Team, Registration } = require('../models');

const formatTournament = (tournamentInstance) => {
  const tournament = tournamentInstance.toJSON();
  return {
    id: tournament.id,
    name: tournament.name,
    description: tournament.description,
    status: tournament.status,
    maxTeams: tournament.maxTeams,
    currentTeams: tournament.currentTeams ?? tournament.Teams?.length ?? 0,
    entryFee: tournament.entryFee,
    prizePool: tournament.prizePool,
    startDate: tournament.startDate,
    endDate: tournament.endDate,
    location: tournament.location,
    rules: tournament.rules,
  };
};

// Get all tournaments
exports.getAllTournaments = async (req, res) => {
  try {
    const tournaments = await Tournament.findAll({
      include: [{ model: Team, attributes: ['id'] }],
      order: [['createdAt', 'DESC']],
    });

    res.json({
      success: true,
      data: tournaments.map(formatTournament),
    });
  } catch (error) {
    console.error('getAllTournaments error:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// Get a single tournament by ID
exports.getTournamentById = async (req, res) => {
  try {
    const { id } = req.params;
    const tournament = await Tournament.findByPk(id, {
      include: [{ model: Team }],
    });

    if (!tournament) {
      return res.status(404).json({ message: 'Tournament not found' });
    }

    res.json({
      success: true,
      data: formatTournament(tournament),
    });
  } catch (error) {
    console.error('getTournamentById error:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// Create a new tournament (protected route)
exports.createTournament = async (req, res) => {
  try {
    const { name, description, maxTeams, entryFee, prizePool, startDate, endDate } = req.body;

    const tournament = await Tournament.create({
      name,
      description,
      maxTeams,
      entryFee,
      prizePool,
      startDate,
      endDate,
      organizerId: req.user.id, // assuming the user is the organizer
    });

    res.status(201).json({
      success: true,
      data: tournament,
    });
  } catch (error) {
    console.error('createTournament error:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// Update a tournament (protected route)
exports.updateTournament = async (req, res) => {
  try {
    const { id } = req.params;
    const tournament = await Tournament.findByPk(id);

    if (!tournament) {
      return res.status(404).json({ message: 'Tournament not found' });
    }

    // Check if the logged-in user is the organizer
    if (tournament.organizerId !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to update this tournament' });
    }

    const updatedTournament = await tournament.update(req.body);

    res.json({
      success: true,
      data: updatedTournament,
    });
  } catch (error) {
    console.error('updateTournament error:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// Delete a tournament (protected route)
exports.deleteTournament = async (req, res) => {
  try {
    const { id } = req.params;
    const tournament = await Tournament.findByPk(id);

    if (!tournament) {
      return res.status(404).json({ message: 'Tournament not found' });
    }

    // Check if the logged-in user is the organizer
    if (tournament.organizerId !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to delete this tournament' });
    }

    await tournament.destroy();

    res.json({
      success: true,
      message: 'Tournament deleted successfully',
    });
  } catch (error) {
    console.error('deleteTournament error:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

exports.registerForTournament = async (req, res) => {
  try {
    const { id } = req.params;
    const { paymentProof = null } = req.body;

    const tournament = await Tournament.findByPk(id);
    if (!tournament) {
      return res.status(404).json({ success: false, message: 'Tournament not found' });
    }

    if (tournament.currentTeams >= tournament.maxTeams) {
      return res.status(400).json({ success: false, message: 'Tournament is already full' });
    }

    const existingRegistration = await Registration.findOne({
      where: { userId: req.user.id, tournamentId: id },
    });

    if (existingRegistration) {
      return res.status(400).json({ success: false, message: 'Already registered for this tournament' });
    }

    const registration = await Registration.create({
      userId: req.user.id,
      tournamentId: id,
      paymentProof,
      paymentStatus: paymentProof ? 'paid' : 'pending',
      status: paymentProof ? 'confirmed' : 'pending',
    });

    await tournament.increment('currentTeams');
    await tournament.reload();

    res.status(201).json({
      success: true,
      data: {
        registration,
        tournament: formatTournament(tournament),
      },
    });
  } catch (error) {
    console.error('registerForTournament error:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};