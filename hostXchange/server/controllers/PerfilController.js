const bcrypt = require('bcrypt');
const perfilDAO = require('../dao/PerfilDAO');
const saltRounds = 10;

// Função para atualizar o perfil completo do usuário
const atualizarPerfil = (req, res) => {
    const { userId } = req.params;
    const { nome, email, senha, cpf, rg, nrpassa, facebook, twitter, instagram, linkedin } = req.body;
    let blOk = true, message = '';

    // Se a senha for enviada, criptografa antes de atualizar
    if (senha) {
        bcrypt.hash(senha, saltRounds, (err, hashedPassword) => {
            if (err) {
                console.log(err);
                message = 'Erro ao criptografar a senha!';
                return res.json({ blOk: false, message });
            }

            // Atualizar o perfil com a senha criptografada
            perfilDAO.atualizarPerfil(userId, { nome, email, senha: hashedPassword, cpf, rg, nrpassa, facebook, twitter, instagram, linkedin }, (err) => {
                if (err) {
                    console.log(err);
                    message = 'Erro ao atualizar o perfil!';
                    return res.json({ blOk: false, message });
                }
                message = 'Perfil atualizado com sucesso!';
                res.json({ blOk, message });
            });
        });
    } else {
        // Se não houver alteração de senha, atualiza apenas os outros campos
        perfilDAO.atualizarPerfil(userId, { nome, email, cpf, rg, nrpassa, facebook, twitter, instagram, linkedin }, (err) => {
            if (err) {
                console.log(err);
                message = 'Erro ao atualizar o perfil!';
                return res.json({ blOk: false, message });
            }
            message = 'Perfil atualizado com sucesso!';
            res.json({ blOk, message });
        });
    }
};

const perfil = async (req, res) => {
    try {
        const { idUser } = req.body;
        const buscaPerfil = await perfilDAO.perfil(idUser);
        res.status(200).json(buscaPerfil);
    } catch (error) {
        console.error('Erro ao buscar perfil:', error);
        res.status(500).json({ blOk: false, message: 'Erro ao buscar perfil!' });
    }
};

module.exports = { atualizarPerfil, perfil };