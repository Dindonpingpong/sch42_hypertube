const express = require('express');
require("./config/passport-setup");
const passport = require("passport");
const cors = require("cors");
const keys = require("./config/keys");
const app = express();
const cookieSession = require("cookie-session");
const cookieParser = require("cookie-parser");
const authRoutes = require('./routes/oauth.routes');
const torrentRoutes = require('./routes/torrent.routes');

app.use(
    cookieSession({
        name: "session",
        keys: [keys.COOKIE_KEY],
        maxAge: 24 * 60 * 60 * 100
    })
);

app.use(cookieParser());
app.use(passport.initialize());
app.use(passport.session());

app.use(
    cors({
        origin: "http://localhost:3000",
        methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
        credentials: true
    })
);

app.use('/api/login', authRoutes);
app.use('/api/torrent', torrentRoutes);

const authCheck = (req, res, next) => {
    if (!req.user) {
      res.status(401).json({
        authenticated: false,
        message: "user has not been authenticated"
      });
    } else {
      next();
    }
  };
  
  app.get("/", authCheck, (req, res) => {
    res.status(200).json({
      authenticated: true,
      message: "user successfully authenticated",
      user: req.user,
      cookies: req.cookies
    });
  });

app.listen(keys.apiPort, () => console.log('App on ' + keys.apiPort));