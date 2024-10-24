const bcrypt = require('bcrypt');
const cadastroDAO = require('../dao/CadastroDAO');
const saltRounds = 10;

const cadastroUsuario = async (req, res) => {
  const { name, email, password, cpf, rg, nrpassa } = req.body;
  
  try {
    const hash = await bcrypt.hash(password, saltRounds);
    const result = await cadastroDAO.cadastroUsuario(name, email, hash, cpf, rg, nrpassa);
    if (result.success) {
      res.status(201).json(result);
    } else {
      res.status(500).json(result);
    }
  } catch (error) {
    res.status(500).json({ success: false, message: 'Erro ao criptografar senha!' });
  }
}

const cadastroHost = async (req, res) => {
  const { idUsuario, nome, endereco, cddestado, cep, tel, email } = req.body;
  
  try {
    const resultHost = await cadastroDAO.cadastroHost(nome, endereco, cddestado, cep, tel, email);
    if (resultHost.success) {
      const resultUpdate = await cadastroDAO.updateTipoUsuario(idUsuario, resultHost.idHost);
      if (resultUpdate.success) {
        res.status(201).json(resultUpdate);
      } else {
        res.status(500).json(resultUpdate);
      }
    } else {
      res.status(500).json(resultHost);
    }
  } catch (error) {
    res.status(500).json({ success: false, message: 'Erro ao criar Host!' });
  }
}

module.exports = { cadastroUsuario, cadastroHost };