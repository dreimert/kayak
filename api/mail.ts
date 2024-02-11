import nodemailer from "nodemailer"

// MAIL="contact@kayakons.ovh"
// MAIL_PASSWORD=""
// MAIL_SMTP="127.0.0.1"
// MAIL_PORT=1025

let configOptions = {
  host: process.env.MAIL_SMTP,
  port: parseInt(process.env.MAIL_PORT),
  // secure: true,
  auth: {
    user: process.env.MAIL,
    pass: process.env.MAIL_PASSWORD
  }
}

const transporter = nodemailer.createTransport(configOptions)

export async function sendMail (to: string, subject: string, text: string, html: string) {
  return await transporter.sendMail({
    from: process.env.MAIL,
    to,
    subject,
    text,
    html
  })
}