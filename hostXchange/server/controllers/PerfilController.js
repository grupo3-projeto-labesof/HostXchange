const bcrypt = require('bcrypt');
const perfilDAO = require('../dao/PerfilDAO');
const saltRounds = 10;

// Função para atualizar o perfil completo do usuário
const atualizarPerfil = async (req, res) => {
    try {
        const { userId, nome, email, senha, cpf, rg, nrpassa, facebook, twitter, instagram, linkedin } = req.body;
        let blOk = true, message = '';

        // Se a senha for enviada, criptografa antes de atualizar
        if (senha) {
            bcrypt.hash(senha, saltRounds, async (err, hashedPassword) => {
                if (err) {
                    console.log(err);
                    message = 'Erro ao criptografar a senha!';
                    return res.json({ blOk: false, message });
                }

                // Atualizar o perfil com a senha criptografada
                const perfil = await perfilDAO.atualizarPerfil(userId, { nome, email, senha: hashedPassword, cpf, rg, nrpassa, facebook, twitter, instagram, linkedin });
                res.status(200).json(perfil);
            });
        } else {
            // Se não houver alteração de senha, atualiza apenas os outros campos
            const perfil = await perfilDAO.atualizarPerfil(userId, { nome, email, cpf, rg, nrpassa, facebook, twitter, instagram, linkedin });
            res.status(200).json(perfil)
        }
    } catch (error) {
        console.error('Erro ao atualizar perfil:', error);
        res.status(500).json({ blOk: false, message: 'Erro ao atualizar perfil!' });
    }
};

const perfil = async (req, res) => {
    try {
        const { idUser } = req.body;
        const dados = await perfilDAO.perfil(idUser);
        res.status(200).json(dados);
    } catch (error) {
        console.error('Erro ao buscar perfil:', error);
        res.status(500).json({ blOk: false, message: 'Erro ao buscar perfil!' });
    }
};

module.exports = { atualizarPerfil, perfil };