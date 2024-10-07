const bcrypt = require('bcrypt');
const loginDAO = require('../dao/LoginDAO');
const session = require('express-session');
const express = require('express');
const app = express();

app.use(session({
  secret: 'aSxaefdb@#41',
  resave: false,
  saveUninitialized: true,
}));

const login = (req, res) => {
  const { email, password } = req.body;
  let blOk = true, message = '';

  loginDAO.login(email, (err, result) => {
    if (err) {
      console.log(err);
      message = 'Erro ao criar usuário!';
      res.json({ blOk: false, message });
    }

    if (result.length > 0) {
      const verificar = result[0];
      bcrypt.compare(password, verificar.senha, (err, comparacao) => {
        if (err) {
          console.error('Erro ao comparar senhas, tente:', err);
          res.status(500).send('Erro no servidor');
          return;
        }

        if (comparacao) {
          req.session.loggedin = true;
          req.session.username = email;
          message = 'Login efetuado com sucesso!';
          res.json({ user: result, blOk, message });
        } else {
          message = 'Senha incorreta!';
          res.json({ blOk: false, message });
        }
      });
    } else {
      message = 'Usuário não existe!';
      res.json({ blOk: false, message });
    }
  });
}


module.exports = { login };