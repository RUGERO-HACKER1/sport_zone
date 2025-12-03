const { Op } = require('sequelize');
const { Match, Team, Tournament } = require('../models');

const matchIncludes = [
  { model: Tournament, attributes: ['id', 'name'] },
  { model: Team, as: 'HomeTeam', attributes: ['id', 'name'] },
  { model: Team, as: 'AwayTeam', attributes: ['id', 'name'] },
];

const formatMatchPayload = (matchInstance) => {
  const match = matchInstance.toJSON();
  const kickoff = new Date(match.matchDate);

  return {
    id: match.id,
    tournamentId: match.tournamentId,
    tournamentName: match.Tournament?.name ?? 'Unknown Tournament',
    status: match.status,
    round: match.round,
    location: match.location,
    matchDate: kickoff.toISOString(),
    readableDate: kickoff.toDateString(),
    readableTime: kickoff.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    homeTeam: match.HomeTeam ? { id: match.HomeTeam.id, name: match.HomeTeam.name } : null,
    awayTeam: match.AwayTeam ? { id: match.AwayTeam.id, name: match.AwayTeam.name } : null,
    score: {
      home: match.homeScore,
      away: match.awayScore,
    },
  };
};

exports.getMatches = async (req, res) => {
  try {
    const { status, tournamentId, from, to, limit } = req.query;

    const where = {};
    if (status) where.status = status;
    if (tournamentId) where.tournamentId = tournamentId;

    if (from || to) {
      where.matchDate = {};
      if (from) {
        where.matchDate[Op.gte] = new Date(from);
      }
      if (to) {
        where.matchDate[Op.lte] = new Date(to);
      }
    }

    const matches = await Match.findAll({
      where,
      include: matchIncludes,
      order: [['matchDate', 'ASC']],
      limit: limit ? Number(limit) : undefined,
    });

    res.json({
      success: true,
      data: matches.map(formatMatchPayload),
    });
  } catch (error) {
    console.error('getMatches error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to load matches',
      error: error.message,
    });
  }
};

exports.createMatch = async (req, res) => {
  try {
    const {
      tournamentId,
      homeTeamId,
      awayTeamId,
      matchDate,
      round = 1,
      location = 'Main Stadium',
      referee = null,
    } = req.body;

    if (!tournamentId || !homeTeamId || !awayTeamId || !matchDate) {
      return res.status(400).json({
        success: false,
        message: 'tournamentId, homeTeamId, awayTeamId and matchDate are required',
      });
    }

    const match = await Match.create({
      tournamentId,
      homeTeamId,
      awayTeamId,
      matchDate,
      round,
      location,
      referee,
    });

    const payload = await Match.findByPk(match.id, { include: matchIncludes });

    res.status(201).json({
      success: true,
      data: formatMatchPayload(payload),
    });
  } catch (error) {
    console.error('createMatch error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create match',
      error: error.message,
    });
  }
};

exports.updateMatch = async (req, res) => {
  try {
    const { id } = req.params;
    const match = await Match.findByPk(id);

    if (!match) {
      return res.status(404).json({
        success: false,
        message: 'Match not found',
      });
    }

    await match.update(req.body);
    const payload = await Match.findByPk(id, { include: matchIncludes });

    res.json({
      success: true,
      data: formatMatchPayload(payload),
    });
  } catch (error) {
    console.error('updateMatch error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update match',
      error: error.message,
    });
  }
};

exports.deleteMatch = async (req, res) => {
  try {
    const { id } = req.params;
    const match = await Match.findByPk(id);

    if (!match) {
      return res.status(404).json({
        success: false,
        message: 'Match not found',
      });
    }

    await match.destroy();

    res.json({
      success: true,
      message: 'Match deleted successfully',
    });
  } catch (error) {
    console.error('deleteMatch error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete match',
      error: error.message,
    });
  }
};

