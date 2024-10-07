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

const cadastroUsuario = (nome, email, password, cpf, rg, nrpassa, callback) => {
    const query = `INSERT INTO USUARIOS (NOME, EMIAL, SENHA, STUSUARIO, TPUSUARI, CPF, RG, NRPASSA) VALUES (?, ?, ?, 'A', 'V', ?, ?, ?)`;
    db.query(query, [nome, email, password, cpf, rg, nrpassa], callback);
};

const cadastroHost = (nome, endereco, cddestado, cep, tel, email, callback) => {
    db.query(`INSERT INTO CONTATO_HOST (NMPROP, ENDERECO, CDDESTADO, NRCEP, TEL, EMAIL, STCADAST) VALUES (
        '${nome}', '${endereco}', '${cddestado}', '${cep}', '${tel}', '${email}')`, (error, results) => {
        if (error) {
            return callback(error);
        }
        callback(null, results.insertId);
    });
};

const updateTipoUsuario = (idUsuario, idHost, callback) => {
    const query = `UPDATE USUARIO
                   SET TPUSUARIO = 'H',
                       IDCONTATO = '${idHost}',
                       WHERE coluna = '${idUsuario}'`;
    db.query(query, [idUsuario, idHost], callback);
};
module.exports = { cadastroUsuario, cadastroHost, updateTipoUsuario };

/* PARA A BASE TESTE
CREATE TABLE CONTATO_HOST(
	IDCTT INT AUTO_INCREMENT,
    NMPROP VARCHAR(100),
    ENDERECO VARCHAR(100),
    CDDESTADO VARCHAR(100),
    NRCEP VARCHAR(100),
    NRTEL VARCHAR(100),
    EMAIL VARCHAR(100), 
    STCADAST VARCHAR(10),
  	DTCADAST TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (IDCTT)
);
*/