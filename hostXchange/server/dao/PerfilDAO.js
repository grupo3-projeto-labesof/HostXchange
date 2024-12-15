const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require('bcrypt');
const saltRounds = 10;

// Função para atualizar o perfil do usuário
const atualizarPerfil = async (userId, data) => {
  try {
    // Atualiza o usuário no banco de dados, incluindo a senha criptografada se houver
    const updatedUser = await prisma.usuario.update({
      where: { idusuario: parseInt(userId) },
      data,
    });

    return { blOk: true, message: "Perfil atualizado!" };
  } catch (error) {
    console.error('Erro ao atualizar o perfil:', error);
    throw error;
  }
};

const perfil = async (userId) => {
  try {
    const dados = await prisma.usuario.findUnique({
      where: { idusuario: parseInt(userId) }, include: {contatoHost: true }
    });

    return { blOk: true, dados };
  } catch (error) {
    console.error('Erro ao buscar perfil:', error);
    throw error;
  }
}

const perfis = async (req) => {
  try {
    const dados = await prisma.usuario.findMany({ include: {contatoHost: true } });
    return { blOk: true, dados };
  } catch (error) {
    console.error('Erro ao buscar perfis:', error);
    throw error;
  }
}

module.exports = { atualizarPerfil, perfil, perfis };