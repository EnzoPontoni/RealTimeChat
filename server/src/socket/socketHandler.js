const jwt = require('jsonwebtoken');
const prisma = require('../utils/prisma');
const roomManager = require('./roomManager');
function setupSocketHandlers(io) {
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
    socket.on('join_room', async ({ roomId }) => {
      try {
        const room = await prisma.room.findUnique({
          where: { id: roomId }
        });

        if (!room) {
          socket.emit('error', { message: 'Sala não encontrada' });
          return;
        }
        socket.join(roomId);
        const roomUsers = roomManager.joinRoom(
          socket.id, 
          roomId, 
          socket.userId, 
          socket.username
        );

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
        socket.emit('message_history', messages);
        socket.to(roomId).emit('user_joined', { 
          username: socket.username 
        });
        io.to(roomId).emit('room_users', roomUsers);

      } catch (error) {
        socket.emit('error', { message: 'Erro ao entrar na sala' });
      }
    });
    socket.on('leave_room', ({ roomId }) => {
      try {
        socket.leave(roomId);

        const result = roomManager.leaveCurrentRoom(socket.id);
        
        if (result) {
          socket.to(result.roomId).emit('user_left', { 
            username: result.username 
          });
          const roomUsers = roomManager.getRoomUsers(result.roomId);
          io.to(result.roomId).emit('room_users', roomUsers);
        }

      } catch (error) {
      }
    });
    socket.on('send_message', async ({ roomId, content }) => {
      try {
        if (!content || content.trim().length === 0) {
          socket.emit('error', { message: 'Mensagem vazia' });
          return;
        }

        if (content.length > 2000) {
          socket.emit('error', { message: 'Mensagem muito longa' });
          return;
        }

        const userInfo = roomManager.getUserInfo(socket.id);
        if (!userInfo || userInfo.currentRoomId !== roomId) {
          socket.emit('error', { message: 'Você não está nesta sala' });
          return;
        }

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

        io.to(roomId).emit('receive_message', message);
        roomManager.stopTyping(socket.id, roomId, socket.username);
        io.to(roomId).emit('user_stop_typing', { username: socket.username });

      } catch (error) {
        socket.emit('error', { message: 'Erro ao enviar mensagem' });
      }
    });
    socket.on('typing_start', ({ roomId }) => {
      try {
        roomManager.startTyping(socket.id, roomId, socket.username);
        socket.to(roomId).emit('user_typing', { 
          username: socket.username 
        });
      } catch (error) {
      }
    });
    socket.on('typing_stop', ({ roomId }) => {
      try {
        roomManager.stopTyping(socket.id, roomId, socket.username);
        socket.to(roomId).emit('user_stop_typing', { 
          username: socket.username 
        });
      } catch (error) {
      }
    });
    socket.on('disconnect', () => {
      const result = roomManager.leaveCurrentRoom(socket.id);
      
      if (result) {
        socket.to(result.roomId).emit('user_left', { 
          username: result.username 
        });
        const roomUsers = roomManager.getRoomUsers(result.roomId);
        io.to(result.roomId).emit('room_users', roomUsers);
      }
    });
  });
}

module.exports = setupSocketHandlers;
