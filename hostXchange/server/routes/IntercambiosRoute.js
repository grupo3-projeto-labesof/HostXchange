const express = require('express');
const intercambios = require('../controllers/IntercambiosController');
const router = express.Router();

router.post('/buscar', intercambios.buscar);
router.post('/cadastrar', intercambios.cadastrar);

module.exports = router;