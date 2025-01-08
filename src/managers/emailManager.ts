
import nodemailer from 'nodemailer'
import { SETTINGS } from '../settings';

export type MailOptions = {
    from: string
    to: string
    subject: string
    text: string
    html: string
}

export const emailManager = {

    async sendEmail(mailData: {}) {

        const transporter = nodemailer.createTransport({
            service: "gmail",
            port: Number(SETTINGS.EMAILMANAGERPORT),
            host: SETTINGS.EMAILMANAGERHOST,
            secure: true,
            auth: {
                user: SETTINGS.EMAILMANAGERLOGIN,
                pass: SETTINGS.EMAILMANAGERPASSWORD,
            },
            // tls: {
            //     rejectUnauthorized: false,
            // },
        });

        console.log('transporter:', transporter);
        console.log('transporter.options:', transporter.options);
        if (transporter.hasOwnProperty('auth')) {
            console.log('transporter.auth:', (transporter as any).auth);
        }

        await new Promise((resolve, reject) => {
            // verify connection configuration
            transporter.verify(function (error: any, success: any) {
                if (error) {
                    console.log(error);
                    reject(error);
                } else {
                    console.log("Server is ready to take our messages");
                    resolve(success);
                }
            });
        });

        await new Promise((resolve, reject) => {
            // send mail
            transporter.sendMail(mailData, (err: any, info: any) => {
                if (err) {
                    console.error(err);
                    reject(err);
                } else {
                    console.log(info);
                    resolve(info);
                }
            });
        });

        return true
    },

    async sendOTPCode(receiversArray: string[], confirmationCode: string) {

        const OTP = `${confirmationCode}`
        const emailText = `<h1>Welcome to Qus Cook App</h1> 
        <p>Your OTP code is: ${OTP}</p>`
        const mailOptions: MailOptions = {
            // from: '"service app" <stud2025@vk.com>', // sender address
            from: `'qus cook app' <${SETTINGS.EMAILMANAGERLOGIN}>`,
            to: receiversArray.join(','),// list of receivers,
            subject: 'Hello! this is registration code ',// Subject line,
            text: emailText,// plain text body
            html: "<b>" + emailText + "</b>",// html body,
        };

        const result = this.sendEmail(mailOptions)

        return result
    },

    async sendRegistrationConfirmation(receiversArray: string[], confirmationCode: string) {

        const confirmLink = `https://mysite.net/confirm-email?code=${confirmationCode}`
        const OTP = `${confirmationCode}`
        const emailText = `<h1>Thank for your registration</h1> 
        <p>To finish registration please follow the link below:<a href=${confirmLink}>complete registration</a></p>
        <p>Your OTP code is: ${OTP}</p>`
        const mailOptions: MailOptions = {
            // from: '"service app" <stud2025@vk.com>', // sender address
            from: `'qus cook app' <${SETTINGS.EMAILMANAGERLOGIN}>`,
            to: receiversArray.join(','),// list of receivers,
            subject: 'Hello! this is registration code ',// Subject line,
            text: emailText,// plain text body
            html: "<b>" + emailText + "</b>",// html body,
        };

        const result = this.sendEmail(mailOptions)

        return result
    },

    async resendRegistrationConfirmation(receiversArray: string[]) {

        const mailOptions: MailOptions = {
            from: '"service app" <stud2025@vk.com>', // sender address
            to: receiversArray.join(','),// list of receivers,
            subject: 'Hello! this is registration',// Subject line,
            text: 'registration code = ' + 'confirmationCode',// plain text body
            html: "<b>registration</b>",// html body,
        };

        const result = this.sendEmail(mailOptions)

        return result
    }

}
