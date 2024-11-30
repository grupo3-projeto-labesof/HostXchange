const bcrypt = require('bcrypt');
const cadastroDAO = require('../dao/CadastroDAO');
const saltRounds = 10;

const cadastroUsuario = async (req, res) => {
  const { nome, email, password, cpf, rg, nrpassa, sexo, passaporte, nacionalidade } = req.body;
  
  try {
    const hash = await bcrypt.hash(password, saltRounds);
    const result = await cadastroDAO.cadastroUsuario(nome, email, hash, cpf, rg, nrpassa, sexo, passaporte, nacionalidade );
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
  // const { idUsuario, nomePropriedade, rua, numero, complemento, cidade, estado, cep, telefone, tipoPropriedade, email } = req.body;
  // cadastroDAO.cadastroHost(nome, endereco, cddestado, cep, tel, email, (err, idHost) => {
  //   if (err) {
  //     console.error('Erro ao criar notícia:', err);
  //     return res.status(500).json({ message: 'Erro ao criar Contato', blOk: false });
  //   }
  //   cadastroDAO.updateTipoUsuario(idUsuario, idHost, (err) => {
  //     if (err) {
  //       console.error('Erro ao alterar usuário:', err);
  //       return res.status(500).json({ message: 'Erro ao alterar usuário', blOk: false });
  //     }
  //     res.status(201).json({ message: 'Usuário alterado para Host com sucesso!', blOk });
  //   });
  // });
  
  try {
    const resultHost = await cadastroDAO.cadastroHost(nomePropriedade, rua, numero, complemento, cidade, estado, cep, telefone, tipoPropriedade, email);
    if (resultHost.success) {
      const resultUpdate = await cadastroDAO.updateTipoUsuario(idUsuario, resultHost.idHost.toString());
      res.status(201).json(resultUpdate);
    }
    res.status(201).json(resultHost);
  } catch (error) {
    res.status(500).json({ success: false, message: 'Erro ao criar Host!' });
  }
}

module.exports = { cadastroUsuario, cadastroHost };