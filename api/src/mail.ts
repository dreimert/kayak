import { HydratedDocument } from "mongoose"
import { readFileSync } from "node:fs"
import nodemailer from "nodemailer"

import { TActivity } from "./models/Activity.js"
import { TClub } from "./models/Club.js"
import { User } from "./models/User.js"
import { ParticipationType } from "./enums/ParticipationType.js"

// MAIL="contact@kayakons.ovh"
// MAIL_PASSWORD=""
// MAIL_SMTP="127.0.0.1"
// MAIL_PORT=1025

let configOptions = {
  host: process.env.MAIL_SMTP,
  port: parseInt(process.env.MAIL_PORT),
  secure: JSON.parse(process.env.MAIL_SECURE),
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASSWORD
  },
  dkim: undefined
}

if (process.env.MAIL_DKIM_DOMAIN) {
  const privateKey = readFileSync(process.env.MAIL_DKIM_PRIVATE_KEY, 'utf-8')

  configOptions.dkim = {
    domainName: process.env.MAIL_DKIM_DOMAIN,
    keySelector: process.env.MAIL_DKIM_KEY,
    privateKey
  }
}

const transporter = nodemailer.createTransport(configOptions)

export async function sendMail (to: string, subject: string, text: string, html: string) {
  console.info('Sending mail', subject, 'to', to)
  try {
    return await transporter.sendMail({
      from: `"Kayakons.ovh" <${process.env.MAIL_USER}>`,
      to,
      subject,
      text,
      html
    })
  } catch (error) {
    console.error('Error sending mail', error);

    return Promise.reject(error)
  }

}

export async function notifyNewActivity (activity: HydratedDocument<TActivity>, club: HydratedDocument<TClub>) {
  const users = User.find({ notifications: activity.type })

  let link = `${process.env['FRONT_URL']}/activity/${activity.id}`

  link = link.replace(process.env.DOMAIN, club.domains[0])

  for await (const user of users) {
    await sendMail(
      `${user.name} <${user.email}>`,
      `Nouvelle activité : ${activity.title}`,
      `Une nouvelle activité a été créée : ${activity.title}. Pour en savoir plus, cliquez sur le lien suivant : ${link}`,
      `<html>Une nouvelle activité a été créée : ${activity.title}. Pour en savoir plus, cliquez sur le lien suivant : <a href="${link}">${link}</a></html>`,
    )
  }
}

export async function notifyActivityCanceled (activity: HydratedDocument<TActivity>, reason: string) {
  const users = User.find({
    _id: {
      $in: activity.participations.filter(p => p.type !== ParticipationType.non && p.type !== ParticipationType.nonRepondu).map(p => p.participant)
    }
  })

  for await (const user of users) {
    await sendMail(
      `${user.name} <${user.email}>`,
      `Activité annulée : ${activity.title}`,
      `L'activité ${activity.title} a été annulée pour la raison : ${reason}.`,
      `<html><p>L'activité ${activity.title} a été annulée.</p><p>${reason}</p></html>`,
    )
  }
}