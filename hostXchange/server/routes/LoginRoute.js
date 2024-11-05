const express = require('express');
const login = require('../controllers/LoginController');
const router = express.Router();

router.post('/'             , login.login          );
router.post('/enviaCodigo'  , login.enviarEmail    );
router.post('/validaCodigo' , login.confirmarCodigo);
router.post('/atualizaSenha', login.atualizaSenha  );

module.exports = router;