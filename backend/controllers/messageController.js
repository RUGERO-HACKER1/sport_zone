const { Message, User } = require('../models');

const formatMessage = (messageInstance) => {
  const message = messageInstance.toJSON();
  return {
    id: message.id,
    content: message.content,
    messageType: message.messageType,
    userId: message.userId,
    createdAt: message.createdAt,
    user: message.User
      ? {
          id: message.User.id,
          teamName: message.User.teamName,
          captainName: message.User.captainName,
          email: message.User.email,
        }
      : null,
  };
};

exports.getMessages = async (req, res) => {
  try {
    const limit = req.query.limit ? Number(req.query.limit) : 50;

    const messages = await Message.findAll({
      include: [{ model: User, attributes: ['id', 'teamName', 'captainName', 'email'] }],
      order: [['createdAt', 'ASC']],
      limit,
    });

    res.json({
      success: true,
      data: messages.map(formatMessage),
    });
  } catch (error) {
    console.error('getMessages error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to load messages',
      error: error.message,
    });
  }
};

exports.createMessage = async (req, res) => {
  try {
    const { content, messageType = 'text' } = req.body;

    if (!content || !content.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Message content is required',
      });
    }

    const newMessage = await Message.create({
      content: content.trim(),
      messageType,
      userId: req.user.id,
    });

    const payload = await Message.findByPk(newMessage.id, {
      include: [{ model: User, attributes: ['id', 'teamName', 'captainName', 'email'] }],
    });

    const formatted = formatMessage(payload);

    const io = req.app.get('io');
    if (io) {
      io.emit('new-message', formatted);
    }

    res.status(201).json({
      success: true,
      data: formatted,
    });
  } catch (error) {
    console.error('createMessage error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send message',
      error: error.message,
    });
  }
};

