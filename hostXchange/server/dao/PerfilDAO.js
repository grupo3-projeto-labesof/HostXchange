const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require('bcrypt');
const saltRounds = 10;

// Função para atualizar o perfil do usuário
const atualizarPerfil = async (userId, data) => {
  try {
    // Atualiza o usuário no banco de dados, incluindo a senha criptografada se houver
    const updatedUser = await prisma.usuario.update({
      where: { id: parseInt(userId) },
      data,
    });

    return updatedUser;
  } catch (error) {
    console.error('Erro ao atualizar o perfil:', error);
    throw error;
  }
};

const perfil = async (userId) => {

  try {
    const buscaPerfil = await prisma.usuario.findUnique({
      where: { id: parseInt(userId) }, include: {contatoHost: true }
    });

    return buscaPerfil;
  } catch (error) {
    console.error('Erro ao buscar perfil:', error);
    throw error;
  }
}

module.exports = { atualizarPerfil, perfil };