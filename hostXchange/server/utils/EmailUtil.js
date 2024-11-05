const nodemailer = require('nodemailer');

// Configuração do serviço de e-mail diretamente
const transporter = nodemailer.createTransport({
    host: 'sandbox.smtp.mailtrap.io',       // Substitua pelo serviço SMTP que você vai usar
    port: 2525,             
    auth: {
        user: 'f9983661b04195',  // O e-mail remetente
        pass: '223c7ba5d9e356'      // A senha ou chave de app gerada
    }
});

exports.sendEmail = (to, subject, text) => {
    const mailOptions = {
        from: 'noreply.hostxchange@gmail.com',  // O remetente será o seu e-mail
        to: to,                      // Destinatário (e-mail do usuário)
        subject: subject,
        text: text                   // Corpo do e-mail
    };

    transporter.sendMail(mailOptions, (err, info) => {
        if (err) {
            console.error('Erro ao enviar e-mail:', err);
        } else {
            console.log('E-mail enviado:', info.response);
        }
    });
};