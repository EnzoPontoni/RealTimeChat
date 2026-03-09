const express = require('express');
const { 
  getRoomMessages, 
  createMessage 
} = require('../controllers/messageController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();
router.use(authMiddleware);

router.get('/room/:roomId', getRoomMessages);
router.post('/', createMessage);

module.exports = router;
