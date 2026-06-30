const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');

const connectDB = require('./config/db');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

const missionRoutes = require('./routes/missionRoutes');
const achievementRoutes = require('./routes/achievementRoutes');
const reflectionRoutes = require('./routes/reflectionRoutes');
const statsRoutes = require('./routes/statsRoutes');

const app = express();

// ── Database ──────────────────────────────────────────
connectDB();

// ── Core middleware ───────────────────────────────────
app.use(helmet());
app.use(express.json({ limit: '100kb' }));
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

// CORS: allow the deployed frontend origin(s) from .env (comma separated),
// plus localhost for development.
const allowedOrigins = (process.env.CLIENT_ORIGIN || 'http://localhost:5173,http://localhost:3000,http://127.0.0.1:5500')
  .split(',')
  .map((o) => o.trim());

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true
  })
);

// Basic rate limiting to protect the API from abuse
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false
});
app.use('/api', limiter);

// ── Health check (used by Render & uptime monitors) ───
app.get('/api/health', (req, res) => {
  res.json({ success: true, status: 'ok', uptime: process.uptime() });
});

// ── Routes ─────────────────────────────────────────────
app.use('/api/missions', missionRoutes);
app.use('/api/achievements', achievementRoutes);
app.use('/api/reflections', reflectionRoutes);
app.use('/api/stats', statsRoutes);

// ── Error handling (must be last) ─────────────────────
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`[Server] KAIROS API running on port ${PORT} (${process.env.NODE_ENV || 'development'})`);
});

module.exports = app;
