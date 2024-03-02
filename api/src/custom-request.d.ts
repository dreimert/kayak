import { HydratedDocument } from "mongoose";
import { TUser } from "./models/User.js";

declare global {
  namespace Express {
    export interface Request {
      user?: HydratedDocument<TUser>;
      session?: any;
    }
  }
}