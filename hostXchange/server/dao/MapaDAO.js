const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const listaIntercambio = async () => {
  try {
      const buscaIntercambio = await prisma.intercambio.findMany({
          include: {
              contatoHost: {
                  select: {
                      nmprop: true,
                      latitude: true,
                      longitude: true,
                      cidade: true,
                      cdestado: true
                  }
              },
              matches: true,
              // Subquery para calcular média de avaliações
              contatoHost: {
                  include: {
                      usuario: {
                          select: {
                              avaliacoesComoAvaliado: {
                                  select: { avaliacao: true }
                              }
                          }
                      }
                  }
              }
          }
      });

      // Calcula média de avaliações e estrutura os dados
      const formattedData = buscaIntercambio.map((intercambio) => {
          const avaliacoes =
              intercambio.contatoHost.usuario?.avaliacoesComoAvaliado.map(
                  (aval) => aval.avaliacao
              ) || [];
          const mediaAvaliacao =
              avaliacoes.length > 0
                  ? avaliacoes.reduce((sum, value) => sum + value, 0) / avaliacoes.length
                  : 0;

          return {
              id: intercambio.idinterc,
              titulo: intercambio.titulo,
              descricao: intercambio.descricao,
              latitude: intercambio.contatoHost?.latitude,
              longitude: intercambio.contatoHost?.longitude,
              cidade: intercambio.contatoHost?.cidade,
              estado: intercambio.contatoHost?.cdestado,
              avaliacao: mediaAvaliacao.toFixed(1)
          };
      });

      return { blOk: true, message: 'Intercâmbios listados com sucesso!', data: formattedData };
  } catch (error) {
      console.error('Erro ao buscar intercâmbios:', error);
      return { blOk: false, message: 'Erro ao listar intercâmbios!' };
  }
};

module.exports = { listaIntercambio };