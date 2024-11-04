const express = require('express');
const cadastros = require('../controllers/CadastroController');
const router = express.Router();

router.post('/cadastroUsuario', cadastros.cadastroUsuario);
router.post('/tornaHost', cadastros.cadastroHost   );

module.exports = router;
