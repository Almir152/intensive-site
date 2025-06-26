require('dotenv').config();
const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const morgan = require('morgan');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { body, validationResult } = require('express-validator');

const app = express();
const PORT = process.env.PORT || 5000;
const DB_PATH = path.join(__dirname, process.env.DB_NAME || 'intensive.db');
const JWT_SECRET = process.env.JWT_SECRET || 'development-secret-key';
const NODE_ENV = process.env.NODE_ENV || 'development';

// =============================================
// 1. Определение всех SPA маршрутов
// =============================================
const SPA_PATHS = [
  '/',
  '/login',
  '/register',
  '/courses',
  '/profile',
  '/admin',
  '/user/:userId',
  '/course/:courseId'
];

// =============================================
// 2. Инициализация базы данных (без изменений)
// =============================================
const db = new sqlite3.Database(DB_PATH, sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
  if (err) {
    console.error('Database connection error:', err);
    process.exit(1);
  }
  console.log('Connected to SQLite database');
});

// ... (остальная инициализация БД без изменений) ...

// =============================================
// 3. Middleware (без изменений)
// =============================================
app.use(cors());
app.use(bodyParser.json());
app.use(helmet());
app.use(morgan(NODE_ENV === 'development' ? 'dev' : 'combined'));

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
});
app.use('/api/', apiLimiter);
app.use(express.static(path.join(__dirname, '../frontend/build')));

// =============================================
// 4. Настройка SPA маршрутов (замена app.get('*'))
// =============================================
SPA_PATHS.forEach(route => {
  app.get(route, (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/build', 'index.html'));
  });
});

// =============================================
// 5. Обработка 404 ошибок
// =============================================

// Для API
app.all('/api/*', (req, res) => {
  res.status(404).json({ 
    error: 'API endpoint not found',
    availableEndpoints: [
      '/api/health',
      '/api/login',
      '/api/register'
      // добавьте другие доступные API endpoints
    ]
  });
});

// Для SPA (перенаправление на главную)
app.get('*', (req, res) => {
  res.redirect('/');
});

// =============================================
// 6. API Routes (без изменений)
// =============================================
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date() });
});

// ... (остальные API маршруты без изменений) ...

// =============================================
// 7. Запуск сервера с проверкой маршрутов
// =============================================
const server = app.listen(PORT, () => {
  console.log(`Server running in ${NODE_ENV} mode on port ${PORT}`);
  console.log('Registered SPA paths:', SPA_PATHS);
});

process.on('SIGTERM', () => {
  console.log('SIGTERM received. Closing server...');
  db.close();
  server.close(() => process.exit(0));
});
