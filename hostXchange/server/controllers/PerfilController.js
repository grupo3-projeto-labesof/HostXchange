const bcrypt = require('bcrypt');
const userDAO = require('../dao/PerfilDAO');
const saltRounds = 10;

// Função para atualizar a descrição e os links de redes sociais
const atualizarPerfil = (req, res) => {
    const { userId } = req.params;
    const { description, socialLinks } = req.body;
    let blOk = true, message = '';

    perfilDAO.atualizarPerfil(userId, description, socialLinks, (err) => {
        if (err) {
            console.log(err);
            message = 'Erro ao atualizar o perfil!';
            return res.json({ blOk: false, message });
        }
        message = 'Perfil atualizado com sucesso!';
        res.json({ blOk, message });
    });
};

module.exports = { atualizarPerfil }; 