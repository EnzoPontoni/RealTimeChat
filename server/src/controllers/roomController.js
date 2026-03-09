const prisma = require('../utils/prisma');

// Listar todas as salas
const getAllRooms = async (req, res) => {
  try {
    const rooms = await prisma.room.findMany({
      orderBy: {
        createdAt: 'desc'
      },
      include: {
        _count: {
          select: { messages: true }
        }
      }
    });

    res.json({ rooms });

  } catch (error) {
    console.error('Erro ao buscar salas:', error);
    res.status(500).json({ 
      error: 'Erro ao buscar salas' 
    });
  }
};

// Buscar uma sala específica
const getRoomById = async (req, res) => {
  try {
    const { id } = req.params;

    const room = await prisma.room.findUnique({
      where: { id },
      include: {
        _count: {
          select: { messages: true }
        }
      }
    });

    if (!room) {
      return res.status(404).json({ 
        error: 'Sala não encontrada' 
      });
    }

    res.json({ room });

  } catch (error) {
    console.error('Erro ao buscar sala:', error);
    res.status(500).json({ 
      error: 'Erro ao buscar sala' 
    });
  }
};

// Criar nova sala
const createRoom = async (req, res) => {
  try {
    const { name, description } = req.body;

    // Validação
    if (!name || name.trim().length === 0) {
      return res.status(400).json({ 
        error: 'Nome da sala é obrigatório' 
      });
    }

    // Verificar se já existe
    const existingRoom = await prisma.room.findUnique({
      where: { name: name.trim() }
    });

    if (existingRoom) {
      return res.status(400).json({ 
        error: 'Já existe uma sala com este nome' 
      });
    }

    // Criar sala
    const room = await prisma.room.create({
      data: {
        name: name.trim(),
        description: description?.trim() || null
      }
    });

    res.status(201).json({ room });

  } catch (error) {
    console.error('Erro ao criar sala:', error);
    res.status(500).json({ 
      error: 'Erro ao criar sala' 
    });
  }
};

// Deletar sala (opcional, pode ser útil)
const deleteRoom = async (req, res) => {
  try {
    const { id } = req.params;

    // Deletar mensagens primeiro (cascade)
    await prisma.message.deleteMany({
      where: { roomId: id }
    });

    // Deletar sala
    await prisma.room.delete({
      where: { id }
    });

    res.json({ 
      message: 'Sala deletada com sucesso' 
    });

  } catch (error) {
    console.error('Erro ao deletar sala:', error);
    res.status(500).json({ 
      error: 'Erro ao deletar sala' 
    });
  }
};

module.exports = {
  getAllRooms,
  getRoomById,
  createRoom,
  deleteRoom
};
