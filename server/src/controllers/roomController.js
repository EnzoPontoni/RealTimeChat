const prisma = require('../utils/prisma');
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
const createRoom = async (req, res) => {
  try {
    const { name, description } = req.body;
    if (!name || name.trim().length === 0) {
      return res.status(400).json({ 
        error: 'Nome da sala é obrigatório' 
      });
    }
    const existingRoom = await prisma.room.findUnique({
      where: { name: name.trim() }
    });

    if (existingRoom) {
      return res.status(400).json({ 
        error: 'Já existe uma sala com este nome' 
      });
    }
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
const deleteRoom = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.message.deleteMany({
      where: { roomId: id }
    });
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
