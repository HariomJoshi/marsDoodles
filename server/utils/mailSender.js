const nodemailer = require('nodemailer');

const mailSender = async(userEmail,mailSubject,mailBody) => {
    try {
        console.log(userEmail, " ", mailSubject, " ", mailBody)
        let transporter = nodemailer.createTransport({
            host:process.env.MAIL_HOST,
            auth:{
                user:process.env.MAIL_USER,
                pass:process.env.MAIL_PASS
            }
        })

        let info = await transporter.sendMail({
            from:`Mars Doodles`,
            to:`${userEmail}`,
            subject:`${mailSubject}`,
            html:`${mailBody}`
        })

    } catch (error) {
        console.log(error)
        console.log("Error occurred while sending mail (config/mailSender)");
    }
}

module.exports = mailSender;