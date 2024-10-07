const express = require('express');
const cadastros = require('../controllers/CadastroController');
const router = express.Router();

router.post('/', cadastros.cadastroUsuario);

module.exports = router;
