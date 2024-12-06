require('dotenv').config();
const dns = require('dns');
const multer = require('multer');
const moment = require('moment');

const emailValidator = require('email-validator');
const nodemailer = require('nodemailer');

const { deleteUserByEmail } = require('./register.js');


// Configuração para armazenamento na memória
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Verifica se as credenciais de e-mail estão definidas
if(!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.error('Credenciais de e-mail não encontradas. Defina as variáveis ​​de ambiente EMAIL_USER e EMAIL_PASS.');
    process.exit(1);
}

// Função para gerar o template do e-mail
const templatEmail = (formData) => {
    const messageStyle = `
        <style>
            .template-container {
                font-family: Montserrat, Trebuchet MS, sans-serif;
                background-color: #161616;
                border-radius: 15px;
                padding: 20px 15px;
                height: auto;
                max-height: -webkit-fit-content;
                max-height: -moz-fit-content;
                max-height: fit-content;
            }
            .template-section {
                display: block;
                max-width: 600px;
                position: relative;
                margin: 0 auto;
                border: 1px solid #660000;
                border-radius: 10px;
                box-shadow: 0 0 20px #660000;
                background-color: #202020;
                z-index: 2;
            }
            .template-heading {
                text-align: center;
                height: 200px;
                border-radius: 10px 10px 0 0;
                background-image: url(https://form-legiaodosprotetores.vercel.app/imgs/banner.jpeg);
                background-size: cover;
                background-repeat: no-repeat;
                background-position: bottom, center;
            }
            .template-reflection {
                position: relative;
                text-align: center;
                height: 100px;
                background: linear-gradient(180deg, #00000000 0%, rgba(32, 32, 32, 1) 100%), url(https://form-legiaodosprotetores.vercel.app/imgs/banner-inverted.jpeg);
                background-size: cover, cover;
                background-repeat: no-repeat, no-repeat;
                background-position: center, top center;
            }
            .template-content { padding: 0px 20px 20px; }
            .template-description {
                font-family: 'Ubuntu', sans-serif;
                font-size: clamp(1rem, 4vw, 1.5rem);
                text-align: center;
                text-transform: uppercase;
                color: #8b0000;
                margin-bottom: 10px;
                width: 80%;
                margin: 0 auto;
                position: relative;
                z-index: 1;
            }
            .template-body {
                padding: 20px;
                border: 1px solid #822236;
                border-radius: 10px;
                line-height: 1.5;
            }
            .body-text {
                border-bottom: 1px dashed #822236;
                width: 100%;
                padding: 15px 0;
            }
            .body-text:last-child { border-bottom: none; }
            .id-text a { color: #af0729; transition: .5s; }
            .id-text a:hover { color: #8a0000; }
            .template-body strong {
                padding: 5px 10px;
                border-radius: 5px;
                color: #8a0000;
            }
            .template-body .id-text {
                border: 1px dashed #333333;
                padding: 5px 10px;
                border-radius: 5px;
                background-color: #2f2f2f;
                color: #a82c45;
            }
            .id-msg {
                display: block;
                margin: 15px auto 0;
                width: 80%;
                word-break: break-word;
                text-align: justify;
                background-color: #af072996;
                border: 1px solid #161616;
                box-shadow: 0 0 5px #161616;
                padding: 10px;
                border-radius: 5px;
                color: #161616;
            }
            .template-footer p {
                font-family: initial;
                text-align: end;
                color: #a82c45;
                font-style: italic;
            }
        </style>
    `;

    const messageBody = `
        <html lang="pt-BR">
            <head>
                <meta charset="UTF-8">
                <link href="https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100..900;1,100..900&display=swap" rel="stylesheet">
                <title>Confirmação de Inscrição - Legião dos Protetores</title>
                ${messageStyle}
            </head>
            <body>
                <div class="template-container">
                    <div class="template-section">
                        <div class="template-overview">
                            <div class="template-heading"></div>
                            <div class="template-reflection"></div>
                            <div class="template-content">
                                <div class="template-description">
                                    <h4>Informações de Cadastro da Legião dos Protetores</h4>
                                </div>
                                <div class="template-body">
                                    <div class="body-text">
                                        <strong>Nome de Código/Identidade Secreta: </strong><span class="id-text">${formData.secretID || 'Não preenchido'}</span>
                                    </div>
                                    <div class="body-text">
                                        <strong>E-mail: </strong><span class="id-text"><a href="mailto:${formData.email}"g>${formData.email || 'Não preenchido'}</a></span>
                                    </div>
                                    <div class="body-text">
                                        <strong>Celular: </strong><span class="id-text"><a href="tel:${formData.phone}">${formData.phone || 'Não preenchido'}</a></span>
                                    </div>
                                    <div class="body-text">
                                        <strong>Gênero: </strong><span class="id-text">${formData.gender || 'Não preenchido'}</span>
                                    </div>
                                    <div class="body-text">
                                        <strong>Data de nascimento: </strong><span class="id-text">${moment(formData.birthdate).format('DD/MM/YYYY') || 'Não preenchido'}</span>
                                    </div>
                                    <div class="body-text">
                                        <strong>Superpoderes: </strong><span class="id-text">${formData.superPoderes || 'Não preenchido'}</span>
                                    </div>
                                    <div class="body-text">
                                        <strong>Outro: </strong><span class="id-text">${formData.other || 'Não preenchido'}</span>
                                    </div>
                                    <div class="body-text">
                                        <strong>Habilidades Especiais: </strong><span class="id-text">${formData.specialSkills || 'Não preenchido'}</span>
                                    </div>
                                    <div class="body-text">
                                        <strong>Equipamentos: </strong><span class="id-text">${formData.equipments || 'Não preenchido'}</span>
                                    </div>
                                    <div class="body-text">
                                        <strong>Origem: </strong><span class="id-text">${formData.origin || 'Não preenchido'}</span>
                                    </div>
                                    <div class="body-text">
                                        <strong>Afiliação: </strong><span class="id-text">${formData.affiliation || 'Não preenchido'}</span>
                                    </div>
                                    <div class="body-text">
                                        <strong>Área de Atuação: </strong><span class="id-text">${formData.areaOfOperation || 'Não preenchido'}</span>
                                    </div>
                                    <div class="body-text">
                                        <strong>Especifique a área de atuação: </strong><span class="id-text">${formData.specificArea || 'Não preenchido'}</span>
                                    </div>
                                    <div class="body-text">
                                        <strong>Missões Completadas: </strong><span class="id-text">${formData.missionsCompleted || 'Não preenchido'}</span>
                                    </div>
                                    <div class="body-text" style="border-bottom: none;">
                                        <strong>Mensagem: </strong>
                                        <div class="id-msg">${formData.msg || 'Não preenchido'}</div>
                                    </div>
                                </div>
                                <span class="template-footer">
                                    <p>Juntos Somos Invencíveis.</p>
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </body>
        </html>
    `;

    return messageBody;
}

// Configuração do transporte de e-mail
let transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com', // service: 'gmail',
    port: 465,
    secure: true,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// Função para validar o domínio de um e-mail
const validateEmailDomain = (email) => {
    return new Promise((resolve, reject) => {
        const domain = email.split('@')[1];

        // Verifica os registros MX do domínio
        dns.resolveMx(domain, (err, addresses) => {
            if (err || !addresses || addresses.length === 0) {
                console.error('Erro ao resolver registros MX:', err || 'Nenhum registro MX encontrado');
                return reject(new Error('Domínio de e-mail inválido ou inacessível'));
            }

            resolve(true); // Se o domínio tem registros MX válidos, significa que ele pode receber e-mails
        });
    });
};

// Função para validar o formato do e-mail
const validateEmailFormat = (email) => {
    console.log(`Verificando formato do e-mail: ${email}`);
    if (!emailValidator.validate(email)) {
        console.log(`Formato do e-mail ${email} inválido`);
        return false; // E-mail com formato inválido
    }
    return true; // E-mail com formato válido
};

// Função para tratar o envio do formulário
const handleFormSubmission = async (req, res) => {
    const formData = req.body;
    const files = req.files;

    const email = formData.email;

    if (!validateEmailFormat(email)) {
        console.error('Formato do e-mail inválido:', email);
        return res.status(400).json({ success: false, message: 'O formato do e-mail informado é inválido. Por favor, verifique o endereço de e-mail e tente novamente.' });
    }

    try {
        // Iniciando validação do domínio de e-mail
        const isEmailValid = await validateEmailDomain(email);
        if (!isEmailValid) {
            // Caso o domínio seja inválido, deleta o usuário e retorna um erro
            await deleteUserByEmail(email);
            console.error('Domínio de e-mail inválido ou inacessível');
            return res.status(400).json({ success: false, message: 'Domínio de e-mail inválido ou inacessível' });
        }
    } catch (error) {
        // Se ocorrer um erro durante a validação do domínio, deleta o usuário e retorna erro
        await deleteUserByEmail(email);
        console.error('Erro na validação do domínio:', error);
        return res.status(500).json({ success: false, message: `Erro na validação do domínio: ${error.message}` });
    }

    // Criando o array de anexos a partir dos arquivos enviados
    const attachments = files.map(file => ({
        filename: file.originalname, // Nome original do arquivo
        content: file.buffer, // Armazenamento do conteúdo do arquivo na memória
        encoding: 'base64' // Codificação do arquivo em base64
    }));

    // Configuração do e-mail a ser enviado
    let mailOptions = {
        from: 'Fernando Caetano <fernkndy@gmail.com>',
        to: email,
        bcc: 'fernkndy@gmail.com',
        subject: 'Confirmação de Inscrição | Legião dos Protetores',
        html: templatEmail(formData),
        attachments: attachments // Arquivos anexados ao e-mail
    };
    
    try {
        // Enviando o e-mail usando o Nodemailer
        const info = await transporter.sendMail(mailOptions);
        console.log('E-mail enviado com sucesso:', info);
        res.status(200).json({ success: true, info: info, message: 'E-mail enviado com sucesso!' });
    } catch (error) {
        await deleteUserByEmail(email);
        console.error('Erro ao enviar e-mail:', error);
        return res.status(500).json({ success: false, error: error.message });
    }
};

// Usando o middleware para o upload de arquivos e depois a função que trata a requisição
module.exports = (req, res) => {
    // Usando o middleware upload para processar o envio de arquivos
    upload.array('filesInput[]')(req, res, (err) => {
        if (err) {
            return res.status(400).json({ success: false, error: err.message });
        }
        handleFormSubmission(req, res); // Chama a função para tratar o envio do formulário após o upload
    });
};