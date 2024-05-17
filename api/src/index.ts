import { expressMiddleware } from '@apollo/server/express4';
import cors from 'cors';
import cookieParser from 'cookie-parser'
import session from 'express-session'
import MongoStore from 'connect-mongo'
import express from 'express'
import passport from 'passport'

import { DB_URI } from './datas/db-mongo.js'
import { magicLogin } from './auth/magicLink.js';
import { db } from './datas/db-mongo.js';
import { server as apolloServer } from './graphql/graphql.js';
import { User } from './models/User.js';
import { Club } from './models/Club.js';
import { isValidObjectId } from 'mongoose';

await db.initDB()

const app = express();

passport.use(magicLogin);

passport.serializeUser(function(user, cb) {
  process.nextTick(function() {
    cb(null, { id: user.id });
  });
});

passport.deserializeUser(function(user, cb) {
  process.nextTick(async function() {
    if (!isValidObjectId(user.id)) {
      return cb(null, null);
    }

    const find = await User.findById(user.id);

    if (!find) {
      console.error('User not found', user.id);
      return cb(null, null);
    }

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
  store: MongoStore.create({ mongoUrl: DB_URI }),
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
    res.redirect('/')
  } else {
    res.redirect(`/profile`)
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

async function createRecurrentActivity () {
  const clubs = await Club.find({})

  clubs.forEach(async (club) => {
    console.info(club.name);
    console.info(await club.createRecurrentActivity());
  })
}

createRecurrentActivity();

setInterval(async () => {
  createRecurrentActivity()
}, 1000 * 60 * 60 * 24);