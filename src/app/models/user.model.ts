import { ID } from "../../types";

export type UserId = ID
export type Phone = string
export type Email = string

export type UserPartial = {
  id: UserId;
  name: string;
}

export type UserFull = User & {
  phone: string;
  email: string;
}

export class User {
  public id: UserId
  public name: string
  public phone?: Phone
  public email?: Email

  constructor (data: Partial<User>) {
    this.id = data.id || ''
    this.name = data.name || ''
    this.phone = data.phone
    this.email = data.email
  }
}
