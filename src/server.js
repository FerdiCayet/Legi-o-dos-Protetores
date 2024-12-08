const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const formHandler = require('./api/register.js');
const sendEmail = require('./api/sendEmail.js');
require('dotenv').config();

const port = process.env.PORT || 3001;

// Configuração de CORS
app.use(cors());

// Configuração do body-parser com limite de 5mb para JSON e URL encoded
app.use(bodyParser.json({ limit: '5mb' }));
app.use(bodyParser.urlencoded({ limit: '5mb', extended: true }));

// Definindo as rotas da API com logs
app.post('/api/register', formHandler);
app.post('/api/sendEmail', sendEmail);

// Servir arquivos estáticos da pasta 'public'
app.use(express.static('public'));

// Iniciar o servidor localmente, caso não esteja em ambiente de produção
if (process.env.MODE_ENV === 'localhost') {
    app.listen(port, () => {
        console.log(`Servidor rodando na porta ${port}`);
    });
}

// Exportar o app para ser usado como função serverless
module.exports = app;