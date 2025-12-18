const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const categoriasController = require('../controllers/categoriasController');

router.use(authMiddleware);

router.get('/', categoriasController.listar);
router.post('/', categoriasController.criar);
router.put('/:id', categoriasController.atualizar);
router.delete('/:id', categoriasController.deletar);

module.exports = router;
