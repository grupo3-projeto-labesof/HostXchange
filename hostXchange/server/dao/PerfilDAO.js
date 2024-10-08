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


// Função para atualizar o perfil do usuário (descrição e links de redes sociais)
const atualizarPerfil = (userId, description, socialLinks, callback) => {
    const query = `
        UPDATE USUARIOS 
        SET DESCRICAO = ?, LINKS_REDES_SOCIAIS = ? 
        WHERE ID = ?
    `;
    db.query(query, [description, JSON.stringify(socialLinks), userId], callback);
};

module.exports = { atualizarPerfil };
