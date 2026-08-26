import nodemailer from 'nodemailer'
import { WELCOME_EMAIL_TEMPLATE } from './templates'

interface WelcomeEmailData {
    email: string
    name: string
    intro: string
}

export const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.NODEMAILER_EMAIL,
        pass: process.env.NODEMAILER_PASSWORD,
    }
})

export const sendWelcomeEmail = async ({email, name, intro}: WelcomeEmailData) => {
    const htmlTemplate = WELCOME_EMAIL_TEMPLATE.replace('{{name}}', name).replace('{{intro}}', intro)

    const mailOptions = {
        from: `StockLens <StockLens@gmail.com>`,
        to: email,
        subject: `Welcome to StockLens`,
        text: 'Thanks for joining StockLens',
        html: htmlTemplate
    }

    await transporter.sendMail(mailOptions)
}