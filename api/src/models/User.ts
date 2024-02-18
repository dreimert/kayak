import { db } from "../datas/db.js";
import { Model } from "./Model.js";
import { ActivityType } from "../enums/ActivityType.js";

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
    this.domain = data.domain;
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
}