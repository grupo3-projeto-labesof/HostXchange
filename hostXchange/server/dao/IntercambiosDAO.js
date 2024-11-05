const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const buscar = async () => {
    try {
        const intercambios = await prisma.intercambio.findMany({
            include: {
                contatoHost: true  // Relacionamento com a tabela ContatoHost
            }
        });
        return intercambios;
    } catch (error) {
        console.error('Erro ao buscar intercâmbios:', error);
        throw error;
    }
};

module.exports = { buscar };