const express = require('express');
const intercambios = require('../controllers/IntercambiosController');
const intercambiosdao = require('../dao/IntercambiosDAO');
const router = express.Router();

router.get('/buscar', intercambios.buscar);
router.post('/cadastrar', intercambios.cadastrar);
router.post('/buscarId', intercambios.buscarPorId);
router.post('/buscarIntercambio', intercambiosdao.getIntercambioById);

module.exports = router;