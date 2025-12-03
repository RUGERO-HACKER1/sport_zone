const { DataTypes } = require('sequelize');

module.exports = (sequelize, Sequelize) => {
  const Team = sequelize.define('Team', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    logo: {
      type: DataTypes.STRING,
      defaultValue: null
    },
    status: {
      type: DataTypes.ENUM('active', 'disqualified', 'inactive'),
      defaultValue: 'active'
    },
    stats: {
      type: DataTypes.JSONB,
      defaultValue: {
        played: 0,
        wins: 0,
        draws: 0,
        losses: 0,
        goalsFor: 0,
        goalsAgainst: 0,
        points: 0
      }
    }
  });

  Team.associate = function(models) {
    Team.belongsTo(models.User, { foreignKey: 'userId' });
    Team.belongsTo(models.Tournament, { foreignKey: 'tournamentId' });
    Team.hasMany(models.Match, { as: 'HomeMatches', foreignKey: 'homeTeamId' });
    Team.hasMany(models.Match, { as: 'AwayMatches', foreignKey: 'awayTeamId' });
  };

  return Team;
};