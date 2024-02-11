import { ID, Model } from "../types-db.js";

export class User implements Model {
  id: ID;
  name?: string;
  email: string;
  phone?: string;

  constructor(data: Partial<User>) {
    this.id = data.id;
    this.name = data.name;
    this.email = data.email;
    this.phone = data.phone;
  }
}