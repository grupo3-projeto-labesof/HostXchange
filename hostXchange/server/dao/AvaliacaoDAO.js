const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const criaAvaliacao = async (avaliadoId, avaliadorId) => {
  try {
    const aval = await prisma.avaliacao.create({
      data: {
        avaliado: {
          connect: { idusuario: avaliadoId }, // Conecta o ID do avaliado
        },
        avaliador: {
          connect: { idusuario: avaliadorId }, // Conecta o ID do avaliador
        },
        snaval: false, // Default value
      },
    });

    return { success: true, message: 'Avaliação feita com sucesso!', idavaliacao: aval.idavaliacao };
  } catch (error) {
    console.error('Erro ao avaliar:', error);
    return { success: false, message: 'Erro ao avaliar!' };
  }
};

const listaAvaliacoes = async (idusuario) => {
  try {
    const avaliacoes = await prisma.avaliacao.findMany({ where: { avaliadoId: idusuario }});

    if (avaliacoes.length > 0) {
      return { success: true, message: 'Avaliações encontradas!', avaliacoes };
    } else {
      return { success: false, message: 'Nenhuma avaliação encontrada!' };
    }
  } catch (error) {
    console.error('Erro ao listar avaliações:', error);
    return { success: false, message: 'Erro ao listar avaliações!' };
  }
};

const atualizaAvaliacao = async (idavaliacao, avaliacao, descricao) => {
  try {
    const avaliacaoAtualizada = await prisma.avaliacao.update({
      where: { idavaliacao },
      data: {
        avaliacao,
        snaval: true,
        descricao,
      },
    });

    return { success: true, message: 'Avaliação atualizada com sucesso!', avaliacaoAtualizada };
  } catch (error) {
    console.error('Erro ao atualizar avaliação:', error);
    return { success: false, message: 'Erro ao atualizar avaliação!' };
  }
};

module.exports = { criaAvaliacao, listaAvaliacoes, atualizaAvaliacao };