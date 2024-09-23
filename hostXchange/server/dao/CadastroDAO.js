const mysql   = require('mysql2');
const config  = require('../config/database');

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

const cadastroUsuario = (nome, email, password, cpf, rg, nrpassa, callback) => {
    const query = `INSERT INTO USUARIOS (NOME, EMAIL, SENHA, STUSUARIO, TPUSUARIO, CPF, RG, NRPASSA) VALUES (?, ?, ?, 'A', 'V', ?, ?, ?)`;
    db.query(query, [nome, email, password, cpf, rg, nrpassa], callback);
};

module.exports = { cadastroUsuario };