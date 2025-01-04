
import nodemailer from 'nodemailer'
import { SETTINGS } from '../settings';
import { error } from 'console';
import { randomInt } from 'crypto';

export type MailOptions = {
    from: string
    to: string
    subject: string
    text: string
    html: string
}

export const emailManager = {
 
    async sendEmail(mailOptions: {}) {

        const transporter = nodemailer.createTransport({
            host: SETTINGS.EMAILMANAGERHOST ,
            port: Number(SETTINGS.EMAILMANAGERPORT),
            secure: true,
            auth: {
                user: SETTINGS.EMAILMANAGERLOGIN,
                pass: SETTINGS.EMAILMANAGERPASSWORD,
            },
            tls: {
                rejectUnauthorized: false,
            },
        });

        transporter.sendMail(mailOptions).catch((error) => console.log(error));

        return true
    },

    async sendOTPCode(receiversArray: string[], confirmationCode: string){

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