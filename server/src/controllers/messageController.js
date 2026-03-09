const prisma = require('../utils/prisma');
const getRoomMessages = async (req, res) => {
  try {
    const { roomId } = req.params;
    const room = await prisma.room.findUnique({
      where: { id: roomId }
    });

    if (!room) {
      return res.status(404).json({ 
        error: 'Sala não encontrada' 
      });
    }
    const messages = await prisma.message.findMany({
      where: { roomId },
      take: 50,
      orderBy: {
        createdAt: 'asc'
      },
      include: {
        user: {
          select: {
            id: true,
            username: true
          }
        }
      }
    });

    res.json({ messages });

  } catch (error) {
    console.error('Erro ao buscar mensagens:', error);
    res.status(500).json({ 
      error: 'Erro ao buscar mensagens' 
    });
  }
};
const createMessage = async (req, res) => {
  try {
    const { roomId, content } = req.body;
    const userId = req.user.userId;
    if (!content || content.trim().length === 0) {
      return res.status(400).json({ 
        error: 'Conteúdo da mensagem é obrigatório' 
      });
    }

    if (!roomId) {
      return res.status(400).json({ 
        error: 'ID da sala é obrigatório' 
      });
    }
    const room = await prisma.room.findUnique({
      where: { id: roomId }
    });

    if (!room) {
      return res.status(404).json({ 
        error: 'Sala não encontrada' 
      });
    }
    const message = await prisma.message.create({
      data: {
        content: content.trim(),
        userId,
        roomId
      },
      include: {
        user: {
          select: {
            id: true,
            username: true
          }
        }
      }
    });

    res.status(201).json({ message });

  } catch (error) {
    console.error('Erro ao criar mensagem:', error);
    res.status(500).json({ 
      error: 'Erro ao criar mensagem' 
    });
  }
};

module.exports = {
  getRoomMessages,
  createMessage
};
