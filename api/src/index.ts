import { expressMiddleware } from '@apollo/server/express4';
import cors from 'cors';
import cookieParser from 'cookie-parser'
import session from 'express-session'
import NedbStore from 'nedb-session-store'
import express from 'express'
import passport from 'passport'

import { magicLogin } from './auth/magicLink.js';
import { initDb, db } from './datas/db.js';
import { server as apolloServer } from './graphql/graphql.js';

initDb();

const app = express();

passport.use(magicLogin);

/* Configure session management.
 *
 * When a login session is established, information about the user will be
 * stored in the session.  This information is supplied by the `serializeUser`
 * function, which is yielding the user ID and username.
 *
 * As the user interacts with the app, subsequent requests will be authenticated
 * by verifying the session.  The same user information that was serialized at
 * session establishment will be restored when the session is authenticated by
 * the `deserializeUser` function.
 *
 * Since every request to the app needs the user ID and username, in order to
 * fetch todo records and render the user element in the navigation bar, that
 * information is stored in the session.
 */
passport.serializeUser(function(user, cb) {
  process.nextTick(function() {
    cb(null, { id: user.id });
  });
});

passport.deserializeUser(function(user, cb) {
  process.nextTick(function() {
    const find = db.users.find((u) => u.id === user.id)

    return cb(null, find);
  });
});

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false, // don't save session if unmodified
  saveUninitialized: false, // don't create session until something stored
  store: new (NedbStore(session))({
    filename: process.env.SESSION_STORE_PATH
  }),
  cookie: { maxAge: 1000 * 60 * 60 * 24 * 60 }
}));
// app.use(csrf());
// app.use(passport.authenticate('session'));
// app.use(function(req, res, next) {
//   // @ts-ignore
//   res.locals.csrfToken = req.csrfToken();
//   next();
// });
app.use(passport.authenticate('session'))

// This is where we POST to from the frontend
app.post("/auth/magiclogin", magicLogin.send);

// The standard passport callback setup
app.get("/auth/magic/callback", passport.authenticate("magiclogin"), (req, res) => {
  if (req.user.name && req.user.phone) {
    res.redirect(process.env.FRONT_URL)
  } else {
    res.redirect(`${process.env.FRONT_URL}/profile`)
  }
})

app.get("/auth/logout", (req, res) => {
  // @ts-ignore
  req.logout(() => console.info('logout'));
  res.redirect(process.env.FRONT_URL);
});

app.get("/auth/user", (req, res) => {
  res.json(req.user);
});

app.use('/graphql', passport.authenticate('session'), expressMiddleware(apolloServer, {
  // @ts-ignore
  context: ({ req, res }) => {
    return {
      user: req.user,
    };
  }
}));

const port = process.env['PORT'] || 4040;

app.listen(port, () => {
  console.info(`API server listening on port ${port}`);
});


db.clubs.forEach((club) => {
  console.info(club.name);
  console.info(club.createRecurrentActivity());
})