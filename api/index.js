require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const { initializeDatabase } = require('../config/db');
const userRoutes = require('../routes/userRoutes');
const { notFound, errorHandler } = require('../middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 3000;

// ─── Security & Utility Middleware ────────────────────────────────────────────
app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ─── Health Check ─────────────────────────────────────────────────────────────
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Backend API is running.',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
  });
});

app.get('/api', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'API v1 is live.',
    endpoints: {
      users: '/api/users',
    },
  });
});

// ─── Routes ───────────────────────────────────────────────────────────────────
app.use('/api/users', userRoutes);

// ─── Error Handlers ───────────────────────────────────────────────────────────
app.use(notFound);
app.use(errorHandler);

// ─── Start Server ─────────────────────────────────────────────────────────────
const startServer = async () => {
  await initializeDatabase();
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📋 API available at http://localhost:${PORT}/api/users`);
  });
};

startServer();

// Export for Vercel serverless
module.exports = app;
