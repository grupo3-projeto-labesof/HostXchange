const express = require('express');
const session = require('express-session');
const cors    = require('cors');

const routeCadastro     = require('./routes/CadastroRoute.js');
const routeLogin        = require('./routes/LoginRoute.js');
const routePerfil       = require('./routes/PerfilRoute');
const routeIntercambios = require('./routes/IntercambiosRoute');
const routeAvaliacao    = require('./routes/AvaliacaoRoute');

const app  = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

app.use(session({
  secret           : 'aSxaefdb@#41',
  resave           : false,
  saveUninitialized: true
}));

app.use(cors({
  origin        : 'http://localhost:4200',
  methods       : ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use('/cadastro'    , routeCadastro);
app.use('/login'       , routeLogin);
app.use('/intercambios', routeIntercambios);
app.use('/perfil'      , routePerfil);
app.use('/avaliacao'   , routeAvaliacao);

app.listen(PORT, () => {
  console.log('Servidor rodando na porta ' + PORT + '!');
});