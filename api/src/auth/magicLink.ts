import _MagicLoginStrategy from "passport-magic-login"

import { sendMail } from "../../mail"

import { db, getUniqId } from "../datas/db.js"
import { User } from "../models/User"

// @ts-ignore
const MagicLoginStrategy = _MagicLoginStrategy.default

export const magicLogin = new MagicLoginStrategy({
  secret: process.env.MAGIC_LINK_SECRET,

  // The authentication callback URL
  callbackUrl: "/auth/magic/callback",

  // Called with th e generated magic link so you can send it to the user
  // "destination" is what you POST-ed from the client
  // "href" is your confirmUrl with the confirmation token,
  // for example "/auth/magiclogin/confirm?token=<longtoken>"
  sendMagicLink: async (destination, href, token, ...others) => {
    const link = `${process.env['API_URL']}${href}`

    await sendMail(
      destination,
      `Lien de connexion à ${process.env.APP_NAME} - token : ${token}`,
      `Cliquez sur ce lien pour terminer votre connexion : ${link}`,
      `Cliquez sur ce lien pour terminer votre connexion : <a href="${link}">${link}</a>`
    )
  },

  // Once the user clicks on the magic link and verifies their login attempt,
  // you have to match their email to a user record in the database.
  // If it doesn't exist yet they are trying to sign up so you have to create a new one.
  // "payload" contains { "destination": "email" }
  // In standard passport fashion, call callback with the error as the first argument (if there was one)
  // and the user data as the second argument!
  verify: (payload, callback) => {
    // Get or create a user with the provided email from the database
    const destination = payload.destination.toLowerCase()

    const user = db.users.find((user) => user.email === destination)

    if (user) {
      callback(null, user)
    } else {
      const user = new User({
        id: getUniqId(db.users),
        email: destination,
      })

      db.users.push(user)

      callback(null, user)
    }
  },

  // Optional: options passed to the jwt.sign call (https://github.com/auth0/node-jsonwebtoken#jwtsignpayload-secretorprivatekey-options-callback)
  jwtOptions: {
    expiresIn: "2 days",
  }
})