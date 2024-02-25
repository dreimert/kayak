import { db } from "../datas/db.js";
import { Model } from "./Model.js";
import { ActivityType } from "../enums/ActivityType.js";
import { sendMail } from "../mail.js";
import { Activity } from "./Activity.js";
import { Club } from "./Club.js";

export class User extends Model {
  name?: string;
  email: string;
  phone?: string;
  domain?: string;
  notifications: ActivityType[];

  constructor(data: Partial<User>) {
    super(data.id, db.users)

    this.name = data.name;
    this.email = data.email;
    this.phone = data.phone;
    this.domain = data.domain || 'cklom';
    this.notifications = data.notifications || [];
  }

  static create (email: User['email'], domain: User['domain']) {
    const user = new User({
      email,
      domain,
    })

    db.users.push(user)

    return user
  }

  static findById (id: User['id']) {
    return db.users.find((user) => user.id === id)
  }

  static findByEmail (email: User['email']) {
    return db.users.find((user) => user.email === email)
  }

  static async notifyNewActivity (activity: Activity, club: Club) {
    const users = db.users.filter((user) => user.notifications.includes(activity.type))

    let link = `${process.env['FRONT_URL']}/activity/${activity.id}`

    link = link.replace(process.env.DOMAIN, `${club.domain}.${process.env.DOMAIN}`)

    for (const user of users) {
      await sendMail(
        `${user.name} <${user.email}>`,
        `Nouvelle activité : ${activity.title}`,
        `Une nouvelle activité a été créée : ${activity.title}. Pour en savoir plus, cliquez sur le lien suivant : ${link}`,
        `<html>Une nouvelle activité a été créée : ${activity.title}. Pour en savoir plus, cliquez sur le lien suivant : <a href="${link}">${link}</a><html>`,
      )
    }
  }
}