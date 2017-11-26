/**
 * Entry Point
 */
"use strict";

const expressBoilerplate = require('node-express-boilerplate-nahid');
const userAccountsExpressBoilerplate = require('node-user-accounts-boilerplate');

const fs = require('fs');
const path = require('path');
const TidyHQAuth = require('./misc/TidyHQAuth');

// will read the '.env' dorfile and add config to process.env
require('dotenv').config();

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
  const collections = require('./collections/index')
  const CachedCollection = require('node-collections-boilerplate/CachedCollection');
  let Storage = require('node-collections-boilerplate/storage/FSStorage');
  let Search = require('node-collections-boilerplate/search/NoSearch');

  context.users = await initialiseCollection(context, {}, CachedCollection, Storage, Search, 'users');
  context.sessions = await initialiseCollection(context, {}, CachedCollection, Storage, Search, 'sessions');

  for (let collection in collections)
  {
    context[collection] = await initialiseCollection(context, collections[collection].searchMeta, CachedCollection, Storage, Search, collection);
  }
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

  accounts.TidyHQClientID = context.tidyHqClientId;
  accounts.TidyHQClientSecret = context.tidyHqClientSecret;
  accounts.auth.push(new TidyHQAuth(accounts));
  accounts.auth[0].ctx = context;

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
  for (let module of ['collections'])
  {
    const plugin = require(`./api/${module}`);
    await plugin(context);
  }

  context.accessToken = 'eddd6840685fe63f2644e20e22b47aa528ac4aca764693506fce2d8b36baa6b4'
  done();
}

expressBoilerplate({
  applicationName: 'Kemba Joggers',
  // yargs settings
  options: {
    'api-prefix': {
      default: '/api/v0'
    },
    'port': {
      'default': process.env.PORT || 8080,
      'type': 'number'
    },
    'data-endpoint': {
      default: path.join(path.dirname(__filename), 'data') + '/'
    },
    tidyHqClientId: {
      'default': process.env.TIDYHQ_CLIENT_ID || '',
    },
    tidyHqClientSecret: {
      'default': process.env.TIDYHQ_CLIENT_SECRET || '',
    },
    tidyHqClientEmail: {
      'default': process.env.TIDYHQ_CLIENT_EMAIL || '',
    },
    tidyHqClientPassword: {
      'default': process.env.TIDYHQ_CLIENT_PASSWORD || '',
    },
  },
  initialise
});
