import { IdSize } from "../datas/db.js";

import { ID } from "../types-db.js";

export class Model {
  id: ID

  constructor (id: ID, collection: Model[]) {
    this.id = id ?? this.getUniqId(collection)
  }

  getUniqId (collection: Model[]) {
    let id: string

    do {
      id = Math.floor(Math.random() * Math.pow(10, IdSize)).toString().padStart(IdSize, '0')
    } while (collection.some((model) => model.id === id))

    return id
  }
}