const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Função para buscar o usuário pelo e-mail
const login = async (email, callback) => {
  try {
    const user = await prisma.usuario.findUnique({
      where: { email: email }, include: {contatoHost: { include: { intercambio: true } } }
    });
    callback(null, user ? [user] : []);
  } catch (error) {
    console.error('Erro na consulta:', error);
    callback(error, null);
  }
};

// Função para atualizar o código de reset de senha do usuário
const updateCodigo = async (email, codigo, callback) => {
  try {
    await prisma.usuario.update({
      where: { email: email },
      data: { CDRESET: codigo },
    });
    callback(null);
  } catch (error) {
    console.error('Erro ao atualizar o código de reset:', error);
    callback(error);
  }
};

// Função para atualizar a senha do usuário
const atualizaSenha = async (email, hash, callback) => {
  try {
    await prisma.usuario.update({
      where: { email: email },
      data: { senha: hash },
    });
    callback(null);
  } catch (error) {
    console.error('Erro ao atualizar a senha:', error);
    callback(error);
  }
};

module.exports = { login, updateCodigo, atualizaSenha };
