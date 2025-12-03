const { DataTypes } = require('sequelize');

module.exports = (sequelize, Sequelize) => {
  const Tournament = sequelize.define('Tournament', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM('registration_open', 'ongoing', 'completed', 'cancelled'),
      defaultValue: 'registration_open'
    },
    maxTeams: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 2
      }
    },
    currentTeams: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    entryFee: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0
    },
    prizePool: {
      type: DataTypes.STRING,
      allowNull: false
    },
    startDate: {
      type: DataTypes.DATE,
      allowNull: false
    },
    endDate: {
      type: DataTypes.DATE,
      allowNull: false
    },
    rules: {
      type: DataTypes.TEXT,
      defaultValue: ''
    },
    location: {
      type: DataTypes.STRING,
      defaultValue: 'Kigali, Rwanda'
    }
  });

  Tournament.associate = function(models) {
    Tournament.hasMany(models.Team, { foreignKey: 'tournamentId' });
    Tournament.hasMany(models.Match, { foreignKey: 'tournamentId' });
    Tournament.hasMany(models.Registration, { foreignKey: 'tournamentId' });
  };

  return Tournament;
};