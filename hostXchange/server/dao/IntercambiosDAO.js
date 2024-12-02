const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const fs = require('fs');

const buscar = async () => {
    try {
        return await prisma.intercambio.findMany({
            include: {
                contatoHost: true,
                contatoHost: {
                    include: {
                        usuario: {
                            include: {
                                avaliacoesComoAvaliado: true // Inclui as avaliações do host
                            }
                        }
                    }
                }
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
            where: { idinterc: Number(id) },
            include: {
                contatoHost: true,
                contatoHost: {
                    include: {
                        usuario: {
                            include: {
                                avaliacoesComoAvaliado: true // Inclui as avaliações do host
                            }
                        }
                    }
                }
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
        const imagens = (dados.imagens || []).slice(0, 10).reduce((acc, img, index) => {
            acc[`img${index + 1}`] = img.path; // Salva a rota da imagem como string
            return acc;
        }, {});

        const novoIntercambio = await prisma.intercambio.create({
            data: {
                nmlocal: "",
                titulo: dados.titulo,
                descricao: dados.descricao,
                servicos: dados.servicos,
                beneficios: dados.beneficios,
                duracao: dados.duracao,
                idhost: Number(dados.idhost),
                ...imagens
            }
        });

        return novoIntercambio;
    } catch (error) {
        console.error('Erro ao cadastrar intercâmbio:', error);
        throw error;
    }
};

const getIntercambioById = async (req, res) => {
    try {
        const { id } = req.body;

        const intercambio = await prisma.intercambio.findUnique({
            where: { idinterc: Number(id) },
            include: {
                contatoHost: {
                    include: {
                        usuario: {
                            include: {
                                avaliacoesComoAvaliado: {
                                    select: {
                                        avaliacao: true,
                                        descricao: true,
                                    },
                                },
                            },
                        },
                    },
                },
            },
        });

        if (!intercambio) {
            return res.status(404).json({ blOk: false, message: 'Intercâmbio não encontrado!' });
        }

        res.status(200).json(intercambio);
    } catch (error) {
        console.error('Erro ao buscar detalhes do intercâmbio:', error);
        res.status(500).json({ blOk: false, message: 'Erro ao buscar detalhes do intercâmbio!' });
    }
};

module.exports = { buscar, buscarPorId, cadastrar, getIntercambioById };
