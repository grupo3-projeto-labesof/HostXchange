const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const listaIntercambio = async () => {
    try {
      const buscaIntercambio = await prisma.intercambio.findUnique({include: {contatoHost: true }
      });

      return { blOk:true, message:'Intercâmbios listados com sucesso!', buscaIntercambio };
    } catch (error) {
      console.error('Erro ao buscar intercâmbios:', error);
      return { blOk:false, message:'Erro ao listar intercâmbios!' };
    }
}

module.exports = { listaIntercambio };