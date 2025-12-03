const express = require('express');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');
require('dotenv').config();

const { sequelize } = require('./models');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});
app.set('io', io);

// Import routes
const authRoutes = require('./routes/auth');
const tournamentRoutes = require('./routes/tournaments');
const teamRoutes = require('./routes/teams');
const matchRoutes = require('./routes/matches');
const messageRoutes = require('./routes/messages');
const registrationRoutes = require('./routes/registrations');
const adminRoutes = require('./routes/admin');
const paymentRoutes = require('./routes/payments');

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static('uploads'));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/tournaments', tournamentRoutes);
app.use('/api/teams', teamRoutes);
app.use('/api/matches', matchRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/registrations', registrationRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/payments', paymentRoutes);

// Test database connection
app.get('/test-db', async (req, res) => {
  try {
    await sequelize.authenticate();
    res.json({
      success: true,
      message: '✅ PostgreSQL connection successful!',
      database: sequelize.config.database
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '❌ Database connection failed',
      error: error.message
    });
  }
});

// Routes
app.get('/', (req, res) => {
  res.json({
    message: 'Dream League Soccer Kigali Tour API',
    version: '1.0.0',
    database: 'PostgreSQL + Sequelize',
    status: 'Server is running! 🚀'
  });
});

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    database: 'PostgreSQL',
    timestamp: new Date().toISOString()
  });
});

// Socket.io for real-time features
io.on('connection', (socket) => {
  console.log('🔌 New client connected:', socket.id);

  socket.on('join-tournament', (tournamentId) => {
    socket.join(tournamentId);
    console.log(`User ${socket.id} joined tournament ${tournamentId}`);
  });

  socket.on('send-message', (data) => {
    io.emit('new-message', data);
  });

  socket.on('match-update', (data) => {
    io.emit('live-match-update', data);
  });

  socket.on('disconnect', () => {
    console.log('🔌 Client disconnected:', socket.id);
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  res.status(500).json({
    success: false,
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : {}
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.originalUrl} not found on this server!`
  });
});

const PORT = process.env.PORT || 5000;

// Start server
const startServer = async () => {
  try {
    // Test database connection
    await sequelize.authenticate();
    console.log('✅ PostgreSQL connection established successfully.');

    // Sync database (in development)
    if (process.env.NODE_ENV === 'development') {
      await sequelize.sync({ alter: true });
      console.log('✅ Database synchronized');
    }

    server.listen(PORT, '0.0.0.0', () => {
      console.log(`🎯 Server running on port ${PORT}`);
      console.log(`📍 Environment: ${process.env.NODE_ENV}`);
      console.log(`🗄️  Database: PostgreSQL`);
      console.log(`🔗 API URL: http://localhost:${PORT}`);
      console.log(`📡 Accessible on Network: http://0.0.0.0:${PORT}`);
    });
  } catch (error) {
    console.error('❌ Unable to start server:', error);
    process.exit(1);
  }
};

startServer();