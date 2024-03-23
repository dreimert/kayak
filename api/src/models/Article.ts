import { HydratedDocument, InferSchemaType, Schema, Types, model } from "mongoose";

import { TUser } from "./User.js";
import { Club } from "./Club.js";

export interface IArticleMethods {
  isAuthorOrClubAdministrator (user: HydratedDocument<TUser> | null): Promise<boolean>
}

const articleSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  // authors: [{
  //   type: Schema.Types.ObjectId,
  //   ref: 'User',
  // }],
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
}, {
  timestamps: true,
  methods: {
    async isAuthorOrClubAdministrator (user: HydratedDocument<TUser> | null) {
      if (!user) {
        return false;
      } else if (this.author.equals(user.id)) {
        return true;
      } else {
        const clubs = await Club.find({ articles: this.id });

        if (clubs.some((club) => club.administrators.includes(user.id))) {
          return true;
        } else {
          return false;
        }
      }
    },
  },
})

export type TArticle = InferSchemaType<typeof articleSchema>;

export const Article = model('Article', articleSchema);