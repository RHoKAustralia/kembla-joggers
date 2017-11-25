/**
 * Entry Point
 */
"use strict";

const expressBoilerplate = require('node-express-boilerplate-nahid');
const userAccountsExpressBoilerplate = require('node-user-accounts-boilerplate');

// const yargs = require('yargs');
//
// const express = require('express');
// const cors = require('cors');
// const compression = require('compression');
// const firebase = require('firebase');
const fs = require('fs');
const path = require('path');
const NoAuth = require('node-user-accounts-boilerplate/auth/NoAuth');
// const auth = require('./misc/auth');

// will read the '.env' dorfile and add config to process.env
// require('dotenv')
//   .config();
//
// // yargs configuration
// const config = yargs
//   .options({
//     'port': {
//       'alias': 'p',
//       'description': 'Port where the service should run',
//       'default': 8080,
//       'type': 'number'
//     },
//     'static': {
//       'default': '',
//       'description': 'Path to static files to serve'
//     },
//     'cors': {
//       'default': true,
//       'description': 'Enable CORS or not'
//     },
//     'compression': {
//       'default': false,
//       'description': 'Enable Compression or not'
//     },
//     'etag': {
//       'default': Date.now()
//         .toString(16),
//       'description': 'Enable Static ETAG or not'
//     },
//     firebaseApiKey: {
//       'default': process.env.FIREBASE_API_KEY || '',
//     },
//     firebaseAuthDomain: {
//       'default': process.env.FIREBASE_AUTH_DOMAIN || '',
//     },
//     firebaseDatabaseURL: {
//       'default': process.env.FIREBASE_DATABASE_URL || '',
//     },
//     firebaseStorageBucket: {
//       'default': process.env.FIREBASE_STORAGE_BUCKET || '',
//     },
//     firebaseMessagingSenderId: {
//       'default': process.env.FIREBASE_MESSAGING_SENDER_ID || '',
//     },
//     tidyHqApiPrefix: {
//       'default': process.env.TIDYHQ_API_PREFIX || 'https://api.tidyhq.com/v1',
//     },
//     tidyHqAuthorizationUrl: {
//       'default': process.env.TIDYHQ_AUTHORIZATION_URL || 'https://accounts.tidyhq.com/oauth/authorize',
//     },
//     tidyHqTokenUrl: {
//       'default': process.env.TIDYHQ_TOKEN_URL || 'https://accounts.tidyhq.com/oauth/token',
//     },
//     tidyHqClientId: {
//       'default': process.env.TIDYHQ_CLIENT_ID || '',
//     },
//     tidyHqClientSecret: {
//       'default': process.env.TIDYHQ_CLIENT_SECRET || '',
//     },
//     'help': {
//       'alias': 'h',
//       'description': 'Show Help',
//     }
//   })
//   .argv;
//
// if (config.help)
// {
//   yargs.showHelp()
//   process.exit(1);
// }
//
//
// let app = express();
//
// // disable tech revealing header
// app.disable('x-powered-by');
// app.disable('etag');
//
// // cross origin api/content access
// if (config.cors)
// {
//   app.use(cors());
// }
//
// app.use(function (req, res, next)
// {
//   res.sendDate = false;
//   if (config.etag && req.headers['if-none-match'] === config.etag)
//   {
//     res.status(304)
//       .send()
//       .end();
//   }
//   else
//   {
//     if (config.etag && req.path && req.path.indexOf('/api') === -1)
//     {
//       res.header('ETag', config.etag)
//         .header('Cache-Control', 'public, max-age=1800');
//     }
//     res.header('X-XSS-Protection', '1; mode=block');
//     res.header('X-Content-Type-Options', 'nosniff');
//     res.header('X-Frame-Options', 'SAMEORIGIN');
//     next();
//   }
// });
//
// if (config.compression)
// {
//   /*eslint no-underscore-dangle: ["error", { "allow": ["_headers"] }]*/
//   app.use(compression({
//     level: 9,
//     filter: (req, res) => typeof res._headers['content-encoding'] === 'undefined',
//     threshold: 0
//   }));
// }
//
// // content
// if (config.static)
// {
//   app.use(express.static(config.static, {
//     etag: false,
//     lastModified: false
//   }));
// }
//
// // firebase
// app.firebase = firebase.initializeApp({
//   apiKey: config.firebaseApiKey,
//   authDomain: config.firebaseAuthDomain,
//   databaseURL: config.firebaseDatabaseURL,
//   storageBucket: config.firebaseStorageBucket,
//   messagingSenderId: config.firebaseMessagingSenderId
// });
//
// config.apiPrefix = '/api/v0';
//
// // authentication
// auth(app, config);
//
// (async() =>
// {
//   app.listen(config.port, () => console.log(`Kemba Joggers is listening on port ${config.port}!`));
// })();

async function initialiseCollection(context, searchMeta = {}, Collection = CachedCollection, Storage, Search, name)
{
  let search = new Search({
    region: context.awsRegion,
    connectionString: context.searchEndpoint + name
  });
  await search.connect();
  let storage = new Storage({
    region: context.awsRegion,
    connectionString: context.dataEndpoint + name,
    updateInterval: 500,
    updateIntervalMax: 3000,
    useStreams: true
  });
  await storage.connect();
  let collection = new Collection({
    storage,
    search,
    searchMeta,
  });
  await collection.initialise();
  collection.context = context;
  return collection;
}

async function initialiseCollections(context)
{
  const CachedCollection = require('node-collections-boilerplate/CachedCollection');
  let Storage = require('node-collections-boilerplate/storage/FSStorage');
  let Search = require('node-collections-boilerplate/search/NoSearch');

  context.users = await initialiseCollection(context, {}, CachedCollection, Storage, Search, 'users');
  context.sessions = await initialiseCollection(context, {}, CachedCollection, Storage, Search, 'sessions');
  context.contacts = await initialiseCollection(context, {}, CachedCollection, Storage, Search, 'contacts');
  context.events = await initialiseCollection(context, {}, CachedCollection, Storage, Search, 'events');
  context.races = await initialiseCollection(context, {}, CachedCollection, Storage, Search, 'races');
  context.courses = await initialiseCollection(context, {}, CachedCollection, Storage, Search, 'courses');
}

/**
 * initialise accounts api and endpoint
 */
async function initialiseAccounts(context)
{
  const accounts = {};

  accounts.prefix = context.apiPrefix + '/accounts'

  // basic
  accounts.users = context.users;
  accounts.sessions = context.sessions;

  // all roles:
  accounts.roles = {
    'admin': 'Volunteer'
  };

  // when a new user registers, these are the roles they get:
  accounts.defaultRoles = {};

  // these roles can edit other users:
  accounts.administratorRoles = {
    'admin': true
  };

  // authentication methods
  accounts.auth = [];

  accounts.loginUserId = 'volunteer';
  accounts.auth.push(new NoAuth(accounts));

  userAccountsExpressBoilerplate(context.app, accounts);
}

/**
 * initialisation callback function
 */
async function initialise(context, done)
{
  context.app.set('json spaces', 1)
  await initialiseCollections(context);
  await initialiseAccounts(context);
  // await initialiseAPI(context);
  for (let file of fs.readdirSync(path.join(path.dirname(__filename), 'api')))
  {
    const plugin = require(`./api/${file}`);
    await plugin(app, config);
  }

  done();
}

expressBoilerplate({
  applicationName: 'Kemba Joggers',
  // yargs settings
  options: {
    'api-prefix': {
      default: '/api/v0'
    },
    'data-endpoint': {
      default: path.join(path.dirname(__filename), 'data') + '/'
    },
  },
  initialise
});
