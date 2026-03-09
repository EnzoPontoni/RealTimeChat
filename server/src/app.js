require('dotenv').config();
const express = require('express');
const { createServer } = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

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
  // Permite requisições sem Origin (health checks/server-to-server)
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

// Configuração do Socket.io com CORS
const io = new Server(httpServer, {
  cors: corsOptions
});

// Middlewares
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logs de requisições em desenvolvimento
if (process.env.NODE_ENV !== 'production') {
  app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`);
    next();
  });
}

// Rotas da API REST
app.use('/api/auth', authRoutes);
app.use('/api/rooms', roomRoutes);
app.use('/api/messages', messageRoutes);

// Rota de health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Rota raiz
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

// Configurar handlers do Socket.io
setupSocketHandlers(io);

// Handler de erro 404
app.use((req, res) => {
  res.status(404).json({ error: 'Rota não encontrada' });
});

// Handler de erro global
app.use((err, req, res, next) => {
  console.error('Erro interno:', err);
  res.status(500).json({ 
    error: 'Erro interno do servidor',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Iniciar servidor
const PORT = process.env.PORT || 3001;

httpServer.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════╗
║   🚀 Real-Time Chat Server             ║
║   ✅ Server running on port ${PORT}      ║
║   🌍 Environment: ${process.env.NODE_ENV || 'development'}        ║
║   📡 Socket.io ready                   ║
╚════════════════════════════════════════╝
  `);
});

// Tratamento de erros não capturados
process.on('unhandledRejection', (error) => {
  console.error('❌ Unhandled Rejection:', error);
});

process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught Exception:', error);
  process.exit(1);
});

module.exports = { app, httpServer, io };
