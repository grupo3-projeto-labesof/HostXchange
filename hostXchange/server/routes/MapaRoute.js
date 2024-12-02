const express = require('express');
const mapa = require('../controllers/MapaController');
const router = express.Router();

router.post('/listar', mapa.listaIntercambio);

module.exports = router;