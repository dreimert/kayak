import { getUniqId } from "../datas/db";

import { ID } from "../types-db";

export class Model {
  constructor (public id: ID, collection: Model[]) {
    this.id = id

    this.id ??= getUniqId(collection)
  }
}