const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const fs = require('fs');

const buscar = async () => {
    try {
        return await prisma.intercambio.findMany({
            include: {
                contatoHost: true
            }
        });
    } catch (error) {
        console.error('Erro ao buscar intercâmbios:', error);
        throw error;
    }
};

const buscarPorId = async (id) => {
    try {
        const intercambio = await prisma.intercambio.findUnique({
            where: { id: Number(id) },
            include: {
                contatoHost: true
            }
        });

        return intercambio;
    } catch (error) {
        console.error('Erro ao buscar intercâmbio por ID:', error);
        throw error;
    }
};

const cadastrar = async (dados) => {
    try {
        const imagens = dados.imagens.slice(0, 10).map((img, index) => ({
            [`img${index + 1}`]: fs.readFileSync(img.path) // Converte a imagem para Buffer
        }));

        const novoIntercambio = await prisma.intercambio.create({
            data: {
                nmlocal: dados.nmlocal,
                titulo: dados.titulo,
                descricao: dados.descricao,
                servicos: dados.servicos,
                beneficios: dados.beneficios,
                duracao: dados.duracao,
                idhost: Number(dados.idhost),
                ...Object.assign({}, ...imagens)
            }
        });

        return novoIntercambio;
    } catch (error) {
        console.error('Erro ao cadastrar intercâmbio:', error);
        throw error;
    }
};

module.exports = { buscar, buscarPorId, cadastrar };
