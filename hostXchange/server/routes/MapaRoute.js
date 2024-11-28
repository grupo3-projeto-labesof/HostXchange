const express = require('express');
const mapa = require('../controllers/MapaController');
const router = express.Router();

router.post('/mapa', mapa.listaIntercambio);

module.exports = router;