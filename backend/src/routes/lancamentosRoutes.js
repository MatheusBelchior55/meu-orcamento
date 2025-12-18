const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const lancamentosController = require('../controllers/lancamentosController');

router.use(authMiddleware);

router.get('/', lancamentosController.listar);
router.post('/', lancamentosController.criar);
router.put('/:id', lancamentosController.atualizar);
router.delete('/:id', lancamentosController.deletar);

module.exports = router;
