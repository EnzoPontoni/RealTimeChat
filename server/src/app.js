require('dotenv').config();
const express = require('express');
const { createServer } = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

if (!process.env.JWT_SECRET) {
  process.exit(1);
}

const authRoutes = require('./routes/authRoutes');
const roomRoutes = require('./routes/roomRoutes');
const messageRoutes = require('./routes/messageRoutes');
const setupSocketHandlers = require('./socket/socketHandler');

const app = express();
const httpServer = createServer(app);

const DEFAULT_CLIENT_ORIGINS = [
  'http://localhost:5173',
  'https://pontonichats.vercel.app'
];

const parsedClientOrigins = (process.env.CLIENT_URL || '')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

const allowedOrigins = parsedClientOrigins.length > 0
  ? parsedClientOrigins
  : DEFAULT_CLIENT_ORIGINS;

const corsOriginValidator = (origin, callback) => {
  if (!origin) {
    return callback(null, true);
  }

  if (allowedOrigins.includes(origin)) {
    return callback(null, true);
  }

  return callback(new Error(`CORS bloqueado para origem: ${origin}`));
};

const corsOptions = {
  origin: corsOriginValidator,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  credentials: true
};
const io = new Server(httpServer, {
  cors: corsOptions
});
app.use(cors(corsOptions));
app.use(helmet());
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { error: 'Muitas tentativas. Tente novamente em 15 minutos.' },
  standardHeaders: true,
  legacyHeaders: false,
});

const apiLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 100,
  message: { error: 'Limite de requisições excedido.' },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use('/api/auth/login', authLimiter);
app.use('/api/auth/register', authLimiter);
app.use('/api', apiLimiter);

app.use('/api/auth', authRoutes);
app.use('/api/rooms', roomRoutes);
app.use('/api/messages', messageRoutes);
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});
app.get('/', (req, res) => {
  res.json({ 
    message: 'Real-Time Chat API',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      auth: '/api/auth',
      rooms: '/api/rooms',
      messages: '/api/messages'
    }
  });
});
setupSocketHandlers(io);
app.use((req, res) => {
  res.status(404).json({ error: 'Rota não encontrada' });
});
app.use((err, req, res, next) => {
  res.status(500).json({ 
    error: 'Erro interno do servidor'
  });
});
const PORT = process.env.PORT || 3001;

httpServer.listen(PORT, () => {
});
process.on('unhandledRejection', () => {
});

process.on('uncaughtException', () => {
  process.exit(1);
});

module.exports = { app, httpServer, io };
