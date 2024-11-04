const express = require('express');
const intercambios = require('../controllers/IntercambiosController');
const router = express.Router();

router.post('/buscar', intercambios.buscar);

module.exports = router;