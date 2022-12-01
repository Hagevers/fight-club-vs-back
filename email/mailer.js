const nodemailer = require('nodemailer');

exports.sendConfirmationEmail = function ({toUser, hash}){
    return new Promise((res, rej) => {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASS
            }
        })
        const message = {
            from: process.env.MAIL_USER,
            to: process.env.MAIL_USER,
            subject: 'Confirmation Code',
            html: 
            `
                <h3>Hello ${toUser.NickName}</h3>
                <p>Thanks for registering to Fight-Club, please follow the instructions to complete your registeration</p>
                <p>To activate your account please followt this link: <a target="_" href="http://localhost:3000/confirm/${hash}">Activate!</a></p>
            `
        }

        transporter.sendMail(messsage, function(err, info){
            if(err) rej(err)
            else res(info)
        })
    })
}