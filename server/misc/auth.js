"use strict";

const cookieParser = require('cookie-parser');
const expressSession = require('express-session');
const passport = require('passport');

const Strategy = require('passport-oauth2').Strategy;

const request = require('./request');

module.exports = function (app, config)
{
  var firebaseMiddleware = require('express-firebase-middleware');
  router.use('/api', firebaseMiddleware.auth);
  /*
  const database = app.firebase.database();

  app.use(cookieParser());
  app.use(expressSession({
    secret: 'acid rain',
    resave: true,
    saveUninitialized: false,
    //store: config.sessions ? new CollectionSessionStore(config.sessions, config) : new MemorySessionStore(config),
  }));
  app.use(passport.initialize());
  app.use(passport.session());

  // User serialisation
  passport.serializeUser(function (user, done)
  {
    console.log('passport.serializeUser', user);
    //done(null, user.id || 'none');
  });
  passport.deserializeUser(function (user, done)
  {
    console.log('passport.deserializeUser', user);
    //done(null, config.users.lookup[user] || {});
  });

  const prefix = `${config.apiPrefix}/accounts/tidyhq`;

  passport.use(new Strategy({
      authorizationURL: config.tidyHqAuthorizationUrl,
      tokenURL: config.tidyHqTokenUrl,
      clientID: config.tidyHqClientId,
      clientSecret: config.tidyHqClientSecret,
      callbackURL: `${prefix}/callback.json`,
      passReqToCallback: true,
      proxy: true,
    }, async (req, accessToken, refreshToken, profile, done) =>
    {
      profile = await request.read(`${config.tidyHqApiPrefix}/contacts/me?access_token=${accessToken}`);
      console.log(accessToken, refreshToken, profile)

      const uid = `tidyhq:${profile.id}`;
      // Save the access token tot he Firebase Realtime Database.
      const databaseTask = admin.database().ref(`/tidyHqAccessToken/${uid}`)
          .set(accessToken);

      // Create or update the user account.
      const userCreationTask = admin.auth().updateUser(uid, {
        name: `${p}`,
        photoURL: photoURL
      }).catch(error => {
        // If user does not exists we create it.
        if (error.code === 'auth/user-not-found') {
          return admin.auth().createUser({
            uid: uid,
          });
        }
        throw error;
      });

      // Wait for all async task to complete then generate and return a custom auth token.
      Promise.all([userCreationTask, databaseTask]).then(() => {
        // Create a Firebase custom auth token.
        const token = admin.auth().createCustomToken(uid);
        console.log('Created Custom token for UID "', uid, '" Token:', token);
        done(null, {uid, token});
      });

    }));

  console.log(`${prefix}/login.json`)

  app.all(`${prefix}/login.json`, passport.authenticate('oauth2', {
    //scope: ['user:email']
  }));

  app.all(`${prefix}/callback.json`, passport.authenticate('oauth2', {
    failureMessage: 'login failed',
    badRequestMessage: 'XXX'
  }), function (req, res)
  {
    // if not req.user.id then it is not a real use
    // i.e. we are forwarding error or custom payload
    if (!req.user.id)
    {
      res.error(req.user.error, audit.LOGIN_FAILURE);
      req.logout();
    }
    else
    {
      // otherwise, we make a fuss about logging in
      res.audit(audit.LOGIN, `Logged in via ${this.method}`, JSON.stringify({
        id: req.user.id,
        displayName: req.user.displayName,
        roles: req.user.roles
      }));

      // for redirect based login methods, we redirect back to some url
      if (redirect)
      {
        res.redirect(redirect);
      }
      else
      {
        // otherwise we return a login success message
        res.success(`Logged in via ${this.method}`, audit.LOGIN);
      }
    }
  });

  //console.log(app.firebase.database());
  //*/
};
