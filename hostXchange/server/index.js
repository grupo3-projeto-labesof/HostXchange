const express = require('express'             );
const mysql   = require('mysql2'              );
const session = require('express-session'     );
const config  = require('./config/database.js');
const cors    = require('cors'                );

const routeCadastro   = require('./routes/CadastroRoute.js');
const routeLogin      = require('./routes/LoginRoute.js'   );

const app  = express();
const PORT = 3000;
const db   = mysql.createConnection(config);

app.use(cors());
app.use(express.json());

app.use(session({
    secret           : 'aSxaefdb@#41'
  , resave           : false
  , saveUninitialized: true
}));

app.use(cors({
    origin        : 'http://localhost:4200'
  , methods       : ['GET', 'POST']
  , allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use('/cadastro'  , routeCadastro);
app.use('/login'     , routeLogin   );

db.connect((err) => {
  if (err) throw err;
  else console.log('Conectado ao banco de dados MySQL!');
});

app.listen(PORT, () => {
  console.log('Servidor rodando na porta ' + PORT + '!');
});