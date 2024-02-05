import { ID } from "../types-db.js";

export class User {
  id: ID;
  name: string;
  email: string;
  phone: string;

  constructor(data: any) {
    this.id = data.id;
    this.name = data.name;
    this.email = data.email;
    this.phone = data.phone;
  }
}