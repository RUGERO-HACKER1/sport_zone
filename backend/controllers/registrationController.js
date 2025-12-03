const { Registration, Tournament } = require('../models');

exports.getMyRegistrations = async (req, res) => {
  try {
    const registrations = await Registration.findAll({
      where: { userId: req.user.id },
      include: [{ model: Tournament, attributes: ['id', 'name', 'startDate', 'endDate', 'status'] }],
      order: [['createdAt', 'DESC']],
    });

    res.json({
      success: true,
      data: registrations,
    });
  } catch (error) {
    console.error('getMyRegistrations error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to load registrations',
      error: error.message,
    });
  }
};

