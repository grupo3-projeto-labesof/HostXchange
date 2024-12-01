const express = require('express');
const router = express.Router();
const matchController = require('../controllers/MatchController');

// Rota para criar um vínculo (match)
router.post('/criarMatch', matchController.criarMatch);

module.exports = router;
