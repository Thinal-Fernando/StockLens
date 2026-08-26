import nodemailer from 'nodemailer'
import { WELCOME_EMAIL_TEMPLATE } from './templates'

interface WelcomeEmailData {    // a TypeScript interface defining what it must contain when someone calls WelcomeEmailData 
    email: string
    name: string
    intro: string
}

export const transporter = nodemailer.createTransport({     // we create a Transporter - The thing Nodemailer uses to communicate with your email provider and actually send the email
    service: 'gmail',
    auth: {
        user: process.env.NODEMAILER_EMAIL,
        pass: process.env.NODEMAILER_PASSWORD,
    }
})

export const sendWelcomeEmail = async ({email, name, intro}: WelcomeEmailData) => {
    const htmlTemplate = WELCOME_EMAIL_TEMPLATE.replace('{{name}}', name).replace('{{intro}}', intro)

    const mailOptions = {          // object describing the email we want to send
        from: `StockLens <StockLens@gmail.com>`,
        to: email,
        subject: `Welcome to StockLens`,
        text: 'Thanks for joining StockLens',
        html: htmlTemplate
    }

    await transporter.sendMail(mailOptions)   // This is where the email is actually sent.
}