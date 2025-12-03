const { Team, User, Tournament } = require('../models');

// Get all teams (with optional filters)
exports.getAllTeams = async (req, res) => {
  try {
    const teams = await Team.findAll({
      include: [
        { model: User, attributes: ['id', 'teamName', 'captainName'] },
        { model: Tournament, attributes: ['id', 'name'] },
      ],
    });
    res.json({
      success: true,
      data: teams,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get a single team by ID
exports.getTeamById = async (req, res) => {
  try {
    const { id } = req.params;
    const team = await Team.findByPk(id, {
      include: [
        { model: User, attributes: ['id', 'teamName', 'captainName'] },
        { model: Tournament, attributes: ['id', 'name'] },
      ],
    });
    if (!team) {
      return res.status(404).json({ message: 'Team not found' });
    }
    res.json({
      success: true,
      data: team,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Create a new team (protected route)
exports.createTeam = async (req, res) => {
  try {
    const { tournamentId, name, logo } = req.body;
    const team = await Team.create({
      userId: req.user.id,
      tournamentId,
      name,
      logo,
    });
    res.status(201).json({
      success: true,
      data: team,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update a team (protected route)
exports.updateTeam = async (req, res) => {
  try {
    const { id } = req.params;
    const team = await Team.findByPk(id);
    if (!team) {
      return res.status(404).json({ message: 'Team not found' });
    }
    // Check if the logged-in user is the team owner
    if (team.userId !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to update this team' });
    }
    const updatedTeam = await team.update(req.body);
    res.json({
      success: true,
      data: updatedTeam,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete a team (protected route)
exports.deleteTeam = async (req, res) => {
  try {
    const { id } = req.params;
    const team = await Team.findByPk(id);
    if (!team) {
      return res.status(404).json({ message: 'Team not found' });
    }
    // Check if the logged-in user is the team owner
    if (team.userId !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to delete this team' });
    }
    await team.destroy();
    res.json({
      success: true,
      message: 'Team deleted successfully',
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};