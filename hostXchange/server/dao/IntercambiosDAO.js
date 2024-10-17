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

const buscar = (callback) => {
    db.query(`SELECT * FROM INTERCAMBIOS`, (error, results) => {
        if (error) {
            console.error('Erro ao buscar informações:', error);
            callback(error, null);
        } else {
            callback(null, results);
        }
    });
};

module.exports = { buscar };
