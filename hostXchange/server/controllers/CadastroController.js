const bcrypt = require('bcrypt');
const userDAO = require('../dao/CadastroDAO');
const saltRounds = 10;

const cadastroUsuario = (req, res)=>{
  const { name, email, password, cpf, rg, nrpassa } = req.body; 
  let blOk = true, message = '';

  bcrypt.hash(password, saltRounds, (err, hash) => {
    if (err) {
      console.log(err);
      message = 'Erro ao criptografar a senha!';
      res.json({ blOk: false, message });
    }

    userDAO.cadastroUsuario(name, email, hash, cpf, rg, nrpassa, (err) => {
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

module.exports = { cadastroUsuario };