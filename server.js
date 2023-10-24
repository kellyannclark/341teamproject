// express web server
const express = require('express');
const bodyParser = require('body-parser');
const mongodb = require('./data/database');
const passport = require("passport");
const session = require("express-session");
const GitHubStrategy = require("passport-github2").Strategy;
const cors = require("cors");


const app = express();
const port = process.env.PORT || 3000;

app
  .use(bodyParser.json())
  .use(session({
    secret: "secret",
    resave: false ,
    saveUninitialized: true ,
}))
// This is the basic express session ({...}) initialization
.use(passport.initialize())
//init passport on every route call
.use(passport.session())
//allow passport to use "express-session"
.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-type, Accept, Z-Key"
);
  res.setHeader("Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS");
  next();
})

.use(cors({ methods: ['GET', 'POST', 'DELETE', 'UPDATE', 'PUT', 'PATCH']}))
.use(cors({ origin: "*"}))
.use("/", require("./routes"));

// GitHub OAuth 
passport.use(new GitHubStrategy({
  clientID: process.env.GITHUB_CLIENT_ID,
  clientSecret: process.env.GITHUB_CLIENT_SECRET,
  callbackURL: process.env.CALLBACK_URL,
}, (accessToken, refreshToken, profile, done) => {
  return done(null, profile);
}));

passport.serializeUser((user, done) => {
  done(null, user);
});
passport.deserializeUser((user, done) => {
  done(null, user);
});
// Routes
app.get('/', (req, res) => {
  res.send(req.session.user !== undefined ? `Logged in as ${req.session.user.displayName}` : 'Logged out');
});

app.get('/github/callback', passport.authenticate('github', {
  failureRedirect: '/api-docs',
  session: false,
}), (req, res) => {
  req.session.user = req.user;
  res.redirect('/');
});



mongodb.initDb((err) => {
  if (err) {
    console.error(err);
  } else {
    app.listen(port, () => {
      console.log(`Database is listening, and the node is running on port ${port}`);
    });
  }
});
