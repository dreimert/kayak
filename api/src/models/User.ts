import { db } from "../datas/db.js";

import { Model } from "./Model.js";

export class User extends Model {
  name?: string;
  email: string;
  phone?: string;

  constructor(data: Partial<User>) {
    super(data.id, db.users)

    this.name = data.name;
    this.email = data.email;
    this.phone = data.phone;
  }
}