import { getUniqId } from "../datas/db.js";

import { ID } from "../types-db.js";

export class Model {
  constructor (public id: ID, collection: Model[]) {
    this.id = id

    this.id ??= getUniqId(collection)
  }
}