"use strict";


const Auth = require('node-user-accounts-boilerplate/auth/Auth');
const Strategy = require('passport-oauth2')
  .Strategy;

/**
 * OAuth login using TidyHQ login provider
 *
 * Requires ```passport-TidyHQ-oauth2``` package.
 */
class TidyHQAuth extends Auth
{

  /**
   * @param {object} options see Auth class + additional options for email configuration.
   */
  constructor(options = {})
  {
    super('tidyhq', options);
    this.description.redirect = true;

    /**
     * OAuth 2 Client ID
     */
    this.TidyHQClientID = options.TidyHQClientID;

    /**
     * OAuth 2 Client Secret
     */
    this.TidyHQClientSecret = options.TidyHQClientSecret;
  }

  /**
   * @override
   */
  install(app, prefix, passport)
  {
    passport.use(new Strategy({
      authorizationURL: 'https://accounts.tidyhq.com/oauth/authorize',
      tokenURL: 'https://accounts.tidyhq.com/oauth/token',
      clientID: this.TidyHQClientID,
      clientSecret: this.TidyHQClientSecret,
      callbackURL: `${prefix}/callback.json`,
      //scope: ['email', 'profile'],
      //state: true,
      passReqToCallback: true,
      proxy: true,
    }, (req, accessToken, refreshToken, profile, done) =>
    {
      console.log(accessToken)
      this.handleUserLoginByProfile(null, profile, done, req)
    }));
    app.all(`${prefix}/login.json`, passport.authenticate('oauth2', {}));
    app.all(`${prefix}/callback.json`, passport.authenticate('oauth2', {}), this.loggedIn(true));
  }

}

module.exports = TidyHQAuth;
