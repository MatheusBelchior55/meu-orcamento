const express = require('express');
const router = express.Router();

const authMiddleware = require('../middleware/authMiddleware');
const userController = require('../controllers/userController');

// Todas as rotas de usuário exigem autenticação
router.use(authMiddleware);

// Obter dados do usuário logado
router.get('/me', userController.getUser);

module.exports = router;
