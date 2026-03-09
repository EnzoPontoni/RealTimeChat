const express = require('express');
const { register, login, verifyToken } = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Rotas públicas
router.post('/register', register);
router.post('/login', login);

// Rota protegida - verificar token
router.get('/verify', authMiddleware, verifyToken);

module.exports = router;
