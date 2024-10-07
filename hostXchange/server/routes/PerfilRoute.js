const express = require('express');
const perfil = require('../controllers/PerfilController');
const router = express.Router();

router.post('/', perfil.atualizarPerfil);

module.exports = router;