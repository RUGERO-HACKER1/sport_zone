const { DataTypes } = require('sequelize');

module.exports = (sequelize, Sequelize) => {
  const Match = sequelize.define('Match', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    homeScore: {
      type: DataTypes.INTEGER,
      defaultValue: null
    },
    awayScore: {
      type: DataTypes.INTEGER,
      defaultValue: null
    },
    matchDate: {
      type: DataTypes.DATE,
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM('scheduled', 'live', 'completed', 'cancelled'),
      defaultValue: 'scheduled'
    },
    round: {
      type: DataTypes.INTEGER,
      defaultValue: 1
    },
    location: {
      type: DataTypes.STRING,
      defaultValue: 'Main Stadium'
    },
    referee: {
      type: DataTypes.STRING,
      defaultValue: null
    }
  });

  Match.associate = function(models) {
    Match.belongsTo(models.Tournament, { foreignKey: 'tournamentId' });
    Match.belongsTo(models.Team, { as: 'HomeTeam', foreignKey: 'homeTeamId' });
    Match.belongsTo(models.Team, { as: 'AwayTeam', foreignKey: 'awayTeamId' });
    Match.belongsTo(models.Team, { as: 'Winner', foreignKey: 'winnerId' });
  };

  return Match;
};