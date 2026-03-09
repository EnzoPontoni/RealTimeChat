const jwt = require('jsonwebtoken');
const prisma = require('../utils/prisma');
const roomManager = require('./roomManager');

/**
 * Configuração dos handlers Socket.io
 * Implementa todos os eventos do contrato definido
 */
function setupSocketHandlers(io) {
  // Middleware de autenticação Socket.io
  io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    
    if (!token) {
      return next(new Error('Token não fornecido'));
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        return next(new Error('Token inválido'));
      }
      socket.userId = decoded.userId;
      socket.username = decoded.username;
      next();
    });
  });

  io.on('connection', (socket) => {
    console.log(`✅ Usuário conectado: ${socket.username} (${socket.id})`);

    // Evento: entrar em uma sala
    socket.on('join_room', async ({ roomId }) => {
      try {
        // Verificar se a sala existe
        const room = await prisma.room.findUnique({
          where: { id: roomId }
        });

        if (!room) {
          socket.emit('error', { message: 'Sala não encontrada' });
          return;
        }

        // Entrar na sala (Socket.io)
        socket.join(roomId);

        // Adicionar ao gerenciador de salas
        const roomUsers = roomManager.joinRoom(
          socket.id, 
          roomId, 
          socket.userId, 
          socket.username
        );

        console.log(`👤 ${socket.username} entrou na sala: ${room.name}`);

        // Buscar histórico das últimas 50 mensagens
        const messages = await prisma.message.findMany({
          where: { roomId },
          take: 50,
          orderBy: { createdAt: 'asc' },
          include: {
            user: {
              select: { id: true, username: true }
            }
          }
        });

        // Enviar histórico para o usuário que entrou
        socket.emit('message_history', messages);

        // Notificar todos na sala sobre novo usuário
        socket.to(roomId).emit('user_joined', { 
          username: socket.username 
        });

        // Enviar lista atualizada de usuários para todos
        io.to(roomId).emit('room_users', roomUsers);

      } catch (error) {
        console.error('Erro ao entrar na sala:', error);
        socket.emit('error', { message: 'Erro ao entrar na sala' });
      }
    });

    // Evento: sair de uma sala
    socket.on('leave_room', ({ roomId }) => {
      try {
        socket.leave(roomId);

        const result = roomManager.leaveCurrentRoom(socket.id);
        
        if (result) {
          console.log(`👋 ${result.username} saiu da sala: ${result.roomId}`);

          // Notificar outros usuários
          socket.to(result.roomId).emit('user_left', { 
            username: result.username 
          });

          // Atualizar lista de usuários
          const roomUsers = roomManager.getRoomUsers(result.roomId);
          io.to(result.roomId).emit('room_users', roomUsers);
        }

      } catch (error) {
        console.error('Erro ao sair da sala:', error);
      }
    });

    // Evento: enviar mensagem
    socket.on('send_message', async ({ roomId, content }) => {
      try {
        // Validar conteúdo
        if (!content || content.trim().length === 0) {
          socket.emit('error', { message: 'Mensagem vazia' });
          return;
        }

        // Criar mensagem no banco
        const message = await prisma.message.create({
          data: {
            content: content.trim(),
            userId: socket.userId,
            roomId
          },
          include: {
            user: {
              select: { id: true, username: true }
            }
          }
        });

        console.log(`💬 ${socket.username} → ${roomId}: ${content.substring(0, 30)}...`);

        // Enviar para todos na sala (incluindo o remetente)
        io.to(roomId).emit('receive_message', message);

        // Parar indicador de digitação automaticamente
        roomManager.stopTyping(socket.id, roomId, socket.username);
        io.to(roomId).emit('user_stop_typing', { username: socket.username });

      } catch (error) {
        console.error('Erro ao enviar mensagem:', error);
        socket.emit('error', { message: 'Erro ao enviar mensagem' });
      }
    });

    // Evento: começar a digitar
    socket.on('typing_start', ({ roomId }) => {
      try {
        roomManager.startTyping(socket.id, roomId, socket.username);
        socket.to(roomId).emit('user_typing', { 
          username: socket.username 
        });
      } catch (error) {
        console.error('Erro no typing_start:', error);
      }
    });

    // Evento: parar de digitar
    socket.on('typing_stop', ({ roomId }) => {
      try {
        roomManager.stopTyping(socket.id, roomId, socket.username);
        socket.to(roomId).emit('user_stop_typing', { 
          username: socket.username 
        });
      } catch (error) {
        console.error('Erro no typing_stop:', error);
      }
    });

    // Evento: desconexão
    socket.on('disconnect', () => {
      console.log(`❌ Usuário desconectado: ${socket.username} (${socket.id})`);

      const result = roomManager.leaveCurrentRoom(socket.id);
      
      if (result) {
        // Notificar sala
        socket.to(result.roomId).emit('user_left', { 
          username: result.username 
        });

        // Atualizar lista de usuários
        const roomUsers = roomManager.getRoomUsers(result.roomId);
        io.to(result.roomId).emit('room_users', roomUsers);
      }
    });
  });
}

module.exports = setupSocketHandlers;
