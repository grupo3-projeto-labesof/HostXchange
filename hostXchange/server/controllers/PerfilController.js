const bcrypt = require('bcrypt');
const perfilDAO = require('../dao/PerfilDAO');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const saltRounds = 10;

// Configuração base do diretório de upload
const uploadsDir = path.join(__dirname, '../../public/assets/usuarios');

// Configuração do multer para salvar as imagens
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const userFolder = path.join(uploadsDir, `user_${req.body.userId}`);
        if (!fs.existsSync(userFolder)) {
            fs.mkdirSync(userFolder, { recursive: true });
        }
        cb(null, userFolder);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname); // Nome único para cada arquivo
    }
});

const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 } // Limite de 5MB por arquivo
}).fields([
    { name: 'fotoPerfil', maxCount: 1 },
    { name: 'fotoCapa', maxCount: 1 }
]);

// Função para atualizar o perfil completo do usuário
const atualizarPerfil = async (req, res) => {
    upload(req, res, async (err) => {
        if (err) {
            console.error('Erro ao fazer upload das imagens:', err);
            return res.status(500).json({ blOk: false, message: 'Erro ao fazer upload das imagens!' });
        }

        try {
            const { userId, nome, email, senha, cpf, rg, nrpassa, facebook, twitter, instagram, linkedin } = req.body;
            let blOk = true, message = '';

            // Paths das imagens de perfil e capa
            const profileImagePath = req.files.fotoPerfil ? `/assets/usuarios/user_${userId}/${req.files.fotoPerfil[0].filename}` : null;
            const coverImagePath = req.files.fotoCapa ? `/assets/usuarios/user_${userId}/${req.files.fotoCapa[0].filename}` : null;

            let perfilData = { nome, email, cpf, rg, nrpassa, facebook, twitter, instagram, linkedin };

            if (profileImagePath) perfilData.fotoPerfil = profileImagePath;
            if (coverImagePath) perfilData.fotoCapa = coverImagePath;

            // Se a senha for enviada, criptografa antes de atualizar
            if (senha) {
                bcrypt.hash(senha, saltRounds, async (err, hashedPassword) => {
                    if (err) {
                        console.log(err);
                        message = 'Erro ao criptografar a senha!';
                        return res.json({ blOk: false, message });
                    }

                    // Atualizar o perfil com a senha criptografada
                    perfilData.senha = hashedPassword;
                    const perfil = await perfilDAO.atualizarPerfil(userId, perfilData);
                    res.status(200).json(perfil);
                });
            } else {
                // Se não houver alteração de senha, atualiza apenas os outros campos
                const perfil = await perfilDAO.atualizarPerfil(userId, perfilData);
                res.status(200).json(perfil);
            }
        } catch (error) {
            console.error('Erro ao atualizar perfil:', error);
            res.status(500).json({ blOk: false, message: 'Erro ao atualizar perfil!' });
        }
    });
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