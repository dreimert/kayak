import { User } from "./models/User.js";

declare global {
  namespace Express {
    export interface Request {
      user?: User;
      session?: any;
    }
  }
}