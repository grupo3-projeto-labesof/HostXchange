const express = require('express');
const avaliacao = require('../controllers/AvaliacaoController');
const router = express.Router();

router.post('/criaAvaliacao'    , avaliacao.criaAvaliacao);
router.post('/listaAvaliacoes'  , avaliacao.listaAvaliacoes);
router.post('/atualizaAvaliacao', avaliacao.atualizaAvaliacao);

module.exports = router;