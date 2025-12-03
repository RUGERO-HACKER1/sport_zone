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

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.get('/', (req, res) => {
  res.json({ 
    message: 'Dream League Soccer Kigali Tour API',
    version: '1.0.0',
    database: 'PostgreSQL + Sequelize',
    status: 'Server is running! 🚀'
  });
});

app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    database: 'PostgreSQL',
    timestamp: new Date().toISOString() 
  });
});

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

// Simple 404 handler at the end
app.use((req, res) => {
  res.status(404).json({ 
    success: false, 
    message: `Route ${req.method} ${req.originalUrl} not found!` 
  });
});

const PORT = process.env.PORT || 5000;

// Start server
const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ PostgreSQL connection established successfully.');

    if (process.env.NODE_ENV === 'development') {
      await sequelize.sync({ alter: true });
      console.log('✅ Database synchronized');
    }

    server.listen(PORT, () => {
      console.log(`🎯 Server running on port ${PORT}`);
      console.log(`📍 Environment: ${process.env.NODE_ENV}`);
      console.log(`🗄️  Database: PostgreSQL`);
      console.log(`🔗 API URL: http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('❌ Unable to start server:', error);
    process.exit(1);
  }
};

startServer();