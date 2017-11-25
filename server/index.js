/**
 * Entry Point
 */
"use strict";

const expressBoilerplate = require('node-express-boilerplate-nahid');
const userAccountsExpressBoilerplate = require('node-user-accounts-boilerplate');

const fs = require('fs');
const path = require('path');
const NoAuth = require('node-user-accounts-boilerplate/auth/NoAuth');

// will read the '.env' dorfile and add config to process.env
require('dotenv')
  .config();

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
    await plugin(context);
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
    tidyHqAuthorizationUrl: {
      'default': process.env.TIDYHQ_AUTHORIZATION_URL || 'https://accounts.tidyhq.com/oauth/authorize',
    },
    tidyHqTokenUrl: {
      'default': process.env.TIDYHQ_TOKEN_URL || 'https://accounts.tidyhq.com/oauth/token',
    },
    tidyHqClientId: {
      'default': process.env.TIDYHQ_CLIENT_ID || '',
    },
    tidyHqClientSecret: {
      'default': process.env.TIDYHQ_CLIENT_SECRET || '',
    },
  },
initialise
});
