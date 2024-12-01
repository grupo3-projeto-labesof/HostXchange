const matchDao = require('../dao/MatchDAO');

const criarMatch = async (req, res) => {
  const { idviajante, idinterc } = req.body;

  try {
    // Verifica se o usuário existe
    const usuario = await matchDao.buscarUsuario(idviajante);
    if (!usuario) {
      return res.status(404).json({ success: false, message: 'Usuário não encontrado.' });
    }

    // Verifica se o intercâmbio existe
    const intercambio = await matchDao.buscarIntercambio(idinterc);
    if (!intercambio) {
      return res.status(404).json({ success: false, message: 'Intercâmbio não encontrado.' });
    }

    // Cria o vínculo (Match)
    const result = await matchDao.criarMatch(idviajante, idinterc);
    res.status(201).json(result);
  } catch (error) {
    console.error('Erro ao criar vínculo:', error);
    res.status(500).json({ success: false, message: 'Erro ao criar vínculo.' });
  }
};

module.exports = { criarMatch };