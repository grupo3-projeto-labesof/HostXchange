const intercambiosDAO = require('../dao/IntercambiosDAO');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

// Configuração base do diretório de upload
const uploadsDir = path.join(__dirname, '../../public/assets/intercambios');

// Configuração do multer para salvar as imagens
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const hostFolder = path.join(uploadsDir, `host_${req.body.idhost}`);
        if (!fs.existsSync(hostFolder)) {
            
            fs.mkdirSync(hostFolder, { recursive: true });
        }
        cb(null, hostFolder);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname); // Nome único para cada arquivo
    }
});

const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 } // Limite de 5MB por arquivo
}).array('images', 10); // Até 10 arquivos no campo 'images'

const buscar = async (req, res) => {
    try {
        const intercambios = await intercambiosDAO.buscar();
        res.status(200).json(intercambios);
    } catch (error) {
        console.error('Erro ao buscar intercâmbios:', error);
        res.status(500).json({ blOk: false, message: 'Erro ao buscar intercâmbios!' });
    }
};

const cadastrar = async (req, res) => {
    upload(req, res, async (err) => {
        if (err) {
            console.error('Erro ao fazer upload das imagens:', err);
            return res.status(500).json({ blOk: false, message: 'Erro ao fazer upload das imagens!' });
        }

        try {
            const { nmlocal, titulo, descricao, servicos, beneficios, duracao, idhost } = req.body;

            // Montando as referências das imagens
            const imagens = req.files.map((file) => ({
                path: file.path
            }));

            // Salvar o intercâmbio no banco de dados
            const intercambio = await intercambiosDAO.cadastrar({
                nmlocal,
                titulo,
                descricao,
                servicos,
                beneficios,
                duracao,
                idhost,
                imagens
            });

            res.status(201).json({ blOk: true, message: 'Intercâmbio cadastrado com sucesso!', intercambio });
        } catch (error) {
            console.error('Erro ao cadastrar intercâmbio:', error);
            res.status(500).json({ blOk: false, message: 'Erro ao cadastrar intercâmbio!' });
        }
    });
};

module.exports = { buscar, cadastrar };
