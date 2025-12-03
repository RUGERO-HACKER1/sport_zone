const { DataTypes } = require('sequelize');

module.exports = (sequelize, Sequelize) => {
  const Registration = sequelize.define('Registration', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    status: {
      type: DataTypes.ENUM('pending', 'confirmed', 'rejected', 'cancelled'),
      defaultValue: 'pending'
    },
    paymentStatus: {
      type: DataTypes.ENUM('pending', 'paid', 'failed', 'refunded'),
      defaultValue: 'pending'
    },
    paymentProof: {
      type: DataTypes.STRING,
      defaultValue: null
    },
    registeredAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  });

  Registration.associate = function(models) {
    Registration.belongsTo(models.User, { foreignKey: 'userId' });
    Registration.belongsTo(models.Tournament, { foreignKey: 'tournamentId' });
  };

  return Registration;
};