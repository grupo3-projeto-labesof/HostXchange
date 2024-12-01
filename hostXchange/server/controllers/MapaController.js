const mapaDAO = require('../dao/MapaDAO');

const listaIntercambio = async (req, res) => {
    try {
        const { idUser } = req.body;
        const buscaIntercambio = await mapaDAO.listaIntercambio;
        res.status(200).json(buscaIntercambio);
    } catch (error) {
        console.error('Erro ao buscar intercâmbio:', error);
        res.status(500).json({ blOk: false, message: 'Erro ao buscar intercâmbio!' });
    }
};
module.exports = { listaIntercambio };