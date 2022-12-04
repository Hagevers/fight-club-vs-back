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
            to: toUser.data.Email,
            subject: 'Confirmation Code',
            html: 
            `
                <h3>Hello ${toUser.NickName}</h3>
                <p>Thanks for registering to Fight-Club, please follow the instructions to complete your registeration</p>
                <p>To activate your account please follow this link: <a target="_" href="https://powerful-anchorage-21815.herokuapp.com/confirm/${hash}">Activate!</a></p>
            `
        }

        transporter.sendMail(message, function(err, info){
            if(err){
                rej(err)
            } 
            else{
                res(info)
            } 
        })
    })
}