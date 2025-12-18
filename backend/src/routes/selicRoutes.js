const express = require('express');
const router = express.Router();
const selicController = require('../controllers/selicController');

router.get('/', selicController.selicAtual);

module.exports = router;
