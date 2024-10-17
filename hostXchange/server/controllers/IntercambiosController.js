const dao = require('../dao/IntercambiosDAO');

const buscar = (req, res) => {
    let blOk = true, message = '';

    dao.buscar((err, result) => {
        if (err) {
            console.log(err);
            message = 'Erro ao buscar intercâmbios!';
            return res.json({ blOk: false, message });
        } else res.json(result);
    });
};

module.exports = { buscar }; 