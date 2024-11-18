const avaliacaoDAO = require('../dao/AvaliacaoDAO');

const criaAvaliacao = async (req, res) => {
    const { avaliado, avaliador } = req.body;
    try {
        const result = await avaliacaoDAO.criaAvaliacao(avaliado, avaliador);
        if (result.success) {
            res.status(201).json(result);
        } else {
            res.status(500).json(result);
        }
    } catch (error) {
        res.status(500).json({ success: false, message: 'Erro ao salvar avaliação!' });
    }
}

const listaAvaliacoes = async (req, res) => {
    const { idusuario } = req.body;

    try {
        const result = await avaliacaoDAO.listaAvaliacoes(idusuario);
        if (result.success) {
            res.status(200).json(result);
        } else {
            res.status(404).json(result);
        }
    } catch (error) {
        console.error('Erro ao listar avaliações:', error);
        res.status(500).json({ success: false, message: 'Erro ao listar avaliações!' });
    }
};

const atualizaAvaliacao = async (req, res) => {
    const { idavaliacao, avaliacao, descricao } = req.body;

    try {
        const result = await avaliacaoDAO.atualizaAvaliacao(idavaliacao, avaliacao, descricao);
        if (result.success) {
            res.status(200).json(result);
        } else {
            res.status(404).json(result);
        }
    } catch (error) {
        console.error('Erro ao atualizar avaliação:', error);
        res.status(500).json({ success: false, message: 'Erro ao atualizar avaliação!' });
    }
};

module.exports = { criaAvaliacao, listaAvaliacoes, atualizaAvaliacao };
