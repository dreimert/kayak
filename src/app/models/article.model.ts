import { ID } from "../../types"

export class Article {
  public id: ID
  public title: string
  public content: string
  public author: ID
  public iCanEdit: boolean

  constructor (data: Partial<Article>) {
    this.id = data.id || ''
    this.title = data.title || ''
    this.content = data.content || ''
    this.author = data.author || ''
    this.iCanEdit = data.iCanEdit || false
  }
}
