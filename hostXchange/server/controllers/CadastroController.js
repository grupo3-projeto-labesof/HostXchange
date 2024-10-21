const bcrypt = require('bcrypt');
const cadastroDAO = require('../dao/CadastroDAO');
const saltRounds = 10;

const cadastroUsuario = (req, res) => {
  const { name, email, password, cpf, rg, nrpassa } = req.body;
  let blOk = true, message = '';

  bcrypt.hash(password, saltRounds, (err, hash) => {
    if (err) {
      console.log(err);
      message = 'Erro ao criptografar a senha!';
      res.json({ blOk: false, message });
    }

    cadastroDAO.cadastroUsuario(name, email, hash, cpf, rg, nrpassa, (err) => {
      if (err) {
        console.log(err);
        message = 'Erro ao criar usuário!';
        res.json({ blOk: false, message });
      }
      message = 'Cadastro realizado com sucesso!';
      res.json({ blOk, message });
    });
  });
}

const cadastroHost = (req, res) => {
  const { idUsuario, nome, endereco, cddestado, cep, tel, email } = req.body;
  let blOk = true, message = '';

  cadastroDAO.cadastroHost(nome, endereco, cddestado, cep, tel, email, (err, idHost) => {
    if (err) {
      console.error('Erro ao criar host:', err);
      message = 'Erro ao criar Host!', blOk = false;
      return res.status(500).json({ message, blok });
    }
    cadastroDAO.updateTipoUsuario(idUsuario, idHost, (err) => {
      if (err) {
        console.error('Erro ao alterar usuário:', err);
        message = 'Erro ao alterar tipo do usuário para Host!', blok = false;
        return res.status(500).json({ message, blok });
      }
      res.status(201).json({ message: 'Usuário alterado para Host com sucesso!', blok });
    });
  });
}

module.exports = { cadastroUsuario, cadastroHost };