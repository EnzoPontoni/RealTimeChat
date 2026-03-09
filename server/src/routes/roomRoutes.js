const express = require('express');
const { 
  getAllRooms, 
  getRoomById, 
  createRoom, 
  deleteRoom 
} = require('../controllers/roomController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Todas as rotas de sala requerem autenticação
router.use(authMiddleware);

router.get('/', getAllRooms);
router.get('/:id', getRoomById);
router.post('/', createRoom);
router.delete('/:id', deleteRoom);

module.exports = router;
