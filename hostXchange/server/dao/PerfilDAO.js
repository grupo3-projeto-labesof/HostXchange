const mysql = require('mysql2');
const config = require('../config/database');

const db = mysql.createConnection({
    host: config.host,
    user: config.user,
    password: config.password,
    database: config.database
});

db.connect((err) => {
    if (err) {
        console.error('Erro ao conectar ao banco de dados:', err);
        return;
    }
});

// Função para atualizar todos os campos do perfil do usuário
const atualizarPerfil = (userId, perfil, callback) => {
    const query = `
        UPDATE USUARIO 
        SET 
            nome = ?, 
            email = ?, 
            senha = ?, 
            cpf = ?, 
            rg = ?, 
            nrpassa = ?, 
            facebook = ?, 
            twitter = ?, 
            instagram = ?, 
            linkedin = ? 
        WHERE idusuario = ?
    `;
    const { nome, email, senha, cpf, rg, nrpassa, facebook, twitter, instagram, linkedin } = perfil;
    db.query(query, [nome, email, senha, cpf, rg, nrpassa, facebook, twitter, instagram, linkedin, userId], callback);
};

module.exports = { atualizarPerfil };