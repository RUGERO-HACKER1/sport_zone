module.exports = {
  async up(queryInterface, Sequelize) {
    const table = await queryInterface.describeTable('Users');
    if (!table.role) {
      await queryInterface.addColumn('Users', 'role', {
        type: Sequelize.ENUM('player', 'admin'),
        allowNull: false,
        defaultValue: 'player'
      });
    }
  },

  async down(queryInterface) {
    const table = await queryInterface.describeTable('Users');
    if (table.role) {
      await queryInterface.removeColumn('Users', 'role');
    }
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_Users_role";');
  }
};

