const intercambiosDAO = require('../dao/IntercambiosDAO');

const buscar = async (req, res) => {
    try {
        const intercambios = await intercambiosDAO.buscar();
        res.status(200).json(intercambios);
    } catch (error) {
        console.error('Erro ao buscar intercâmbios:', error);
        res.status(500).json({ blOk: false, message: 'Erro ao buscar intercâmbios!' });
    }
};

module.exports = { buscar };