const express = require('express');
const cors    = require('cors'   );

const app  = express();
const PORT = 3000;

const homeRoute = require('./server/route/HomeRoute');

app.use(cors());
app.use(express.json());

app.use(cors({
    origin        : 'http://localhost:4200'
  , methods       : ['GET', 'POST']
  , allowedHeaders: ['Content-Type', 'Authorization']
}));


app.use('/', homeRoute);  // Rota principal

// Inicia o servidor
app.listen(PORT, () => {
  console.log("Servidor rodando na porta " + PORT);
});