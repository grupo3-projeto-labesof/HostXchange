const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const buscarUsuario = async (idusuario) => {
  try {
    const usuario = await prisma.usuario.findUnique({ where: { idusuario } });
    return usuario;
  } catch (error) {
    console.error('Erro ao buscar usuário:', error);
    throw new Error('Erro ao buscar usuário.');
  }
};

const buscarIntercambio = async (idinterc) => {
  try {
    const intercambio = await prisma.intercambio.findUnique({ where: { idinterc } });
    return intercambio;
  } catch (error) {
    console.error('Erro ao buscar intercâmbio:', error);
    throw new Error('Erro ao buscar intercâmbio.');
  }
};

const criarMatch = async (idviajante, idinterc) => {
  try {
    const match = await prisma.match.create({
      data: {
        idviajante,
        idinterc,
      },
    });
    return { success: true, match };
  } catch (error) {
    console.error('Erro ao criar vínculo (match):', error);
    return { success: false, message: 'Erro ao criar vínculo (match).' };
  }
};

module.exports = { buscarUsuario, buscarIntercambio, criarMatch, };
