const { User, Tournament, Team, Match } = require('../models');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Create sample users
    await User.bulkCreate([
      {
        teamName: 'Kigali Warriors',
        captainName: 'John Doe',
        email: 'warriors@example.com',
        phone: '+250785617178',
        password: 'password123',
        status: 'active',
        role: 'player'
      },
      {
        teamName: 'Dream FC',
        captainName: 'Jane Smith',
        email: 'dreamfc@example.com',
        phone: '+250785617179',
        password: 'password123',
        status: 'active',
        role: 'player'
      },
      {
        teamName: 'Sport Zone Admins',
        captainName: 'System Admin',
        email: 'admin@sportzone.com',
        phone: '+250700000000',
        password: 'Admin@123',
        status: 'active',
        role: 'admin'
      }
    ], { validate: true, individualHooks: true });

    // Create sample tournament
    const tournament = await Tournament.create({
      name: 'Kigali Tour Championship',
      description: 'Main championship tournament with amazing prizes!',
      status: 'registration_open',
      maxTeams: 200,
      currentTeams: 2,
      entryFee: 500,
      prizePool: '40,000 RWF',
      startDate: new Date('2025-12-15'),
      endDate: new Date('2025-12-20'),
      location: 'Kigali, Rwanda'
    });

    console.log('✅ Sample data seeded successfully');
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Users', null, {});
    await queryInterface.bulkDelete('Tournaments', null, {});
  }
};