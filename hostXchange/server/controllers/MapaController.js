const mapaDAO = require('../dao/MapaDAO');

const listaIntercambio = async (req, res) => {
    try {
        const result = await mapaDAO.listaIntercambio();
        if (result.blOk) {
            res.status(200).json(result);
        } else {
            res.status(500).json(result);
        }
    } catch (error) {
        console.error('Erro ao buscar intercâmbio:', error);
        res.status(500).json({ blOk: false, message: 'Erro ao buscar intercâmbio!' });
    }
};

module.exports = { listaIntercambio };