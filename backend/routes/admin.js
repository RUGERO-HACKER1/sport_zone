const express = require('express');
const { protect, requireAdmin } = require('../middleware/auth');
const { User, Tournament, Team, Match } = require('../models');

const router = express.Router();

router.use(protect, requireAdmin);

router.get('/overview', async (req, res) => {
  try {
    const [users, tournaments, teams, matches] = await Promise.all([
      User.count(),
      Tournament.count(),
      Team.count(),
      Match.count(),
    ]);

    res.json({
      success: true,
      data: {
        totals: { users, tournaments, teams, matches },
        admin: {
          id: req.user.id,
          email: req.user.email,
          teamName: req.user.teamName,
        },
      },
    });
  } catch (error) {
    console.error('Admin overview error:', error);
    res.status(500).json({ success: false, message: 'Failed to load admin data' });
  }
});

// Get all users
router.get('/users', async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: { exclude: ['password'] },
      order: [['createdAt', 'DESC']]
    });
    res.json({ success: true, data: users });
  } catch (error) {
    console.error('Fetch users error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch users' });
  }
});

// Get all registrations
router.get('/registrations', async (req, res) => {
  try {
    // We need to import Registration model if not already available in the destructuring at top
    // But let's check imports first. It seems Registration wasn't imported in the original file.
    // I will need to update the imports as well.
    const { Registration } = require('../models');

    const registrations = await Registration.findAll({
      include: [
        { model: User, attributes: ['id', 'teamName', 'email', 'phone'] },
        { model: Tournament, attributes: ['id', 'name', 'fee'] }
      ],
      order: [['createdAt', 'DESC']]
    });
    res.json({ success: true, data: registrations });
  } catch (error) {
    console.error('Fetch registrations error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch registrations' });
  }
});

// Update registration status (Payment Approval)
router.put('/registrations/:id/status', async (req, res) => {
  try {
    const { Registration } = require('../models');
    const { status, paymentStatus } = req.body;

    const registration = await Registration.findByPk(req.params.id);
    if (!registration) {
      return res.status(404).json({ success: false, message: 'Registration not found' });
    }

    if (status) registration.status = status;
    if (paymentStatus) registration.paymentStatus = paymentStatus;

    await registration.save();

    res.json({ success: true, data: registration, message: 'Registration updated successfully' });
  } catch (error) {
    console.error('Update registration error:', error);
    res.status(500).json({ success: false, message: 'Failed to update registration' });
  }
});

module.exports = router;

