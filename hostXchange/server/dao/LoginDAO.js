/*const mysql   = require('mysql2');
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
});*/

const login = (email, callback) => {
    db.query(`SELECT * FROM usuarios WHERE email = '${email}'`, (error, results) => {
      if (error) {
        console.error('Erro na consulta:', error);
        callback(error, null);
      } else {
        callback(null, results);
      }
    });
};

module.exports = { login };