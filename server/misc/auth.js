"use strict";

const cookieParser = require('cookie-parser');
const expressSession = require('express-session');
const passport = require('passport');

module.exports = function (app, config)
{
  app.use(cookieParser());
  app.use(expressSession({
    secret: 'acid rain',
    resave: true,
    saveUninitialized: false,
    //store: config.sessions ? new CollectionSessionStore(config.sessions, config) : new MemorySessionStore(config),
  }));
  app.use(passport.initialize());
  app.use(passport.session());
  console.log(app.firebase.database());
};
