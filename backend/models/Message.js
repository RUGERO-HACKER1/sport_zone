const { DataTypes } = require('sequelize');

module.exports = (sequelize, Sequelize) => {
  const Message = sequelize.define('Message', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    messageType: {
      type: DataTypes.ENUM('text', 'system', 'announcement'),
      defaultValue: 'text'
    }
  });

  Message.associate = function(models) {
    Message.belongsTo(models.User, { foreignKey: 'userId' });
  };

  return Message;
};