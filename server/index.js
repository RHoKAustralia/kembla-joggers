/**
 * Entry Point
 */
"use strict";

const yargs = require('yargs');

const express = require('express');
const cors = require('cors');
const compression = require('compression');
const firebase = require('firebase');
const fs = require('fs');
const path = require('path');

const config = yargs
  .options({
    'port': {
      'alias': 'p',
      'description': 'Port where the service should run',
      'default': 8080,
      'type': 'number'
    },
    'static': {
      'default': '',
      'description': 'Path to static files to serve'
    },
    'cors': {
      'default': true,
      'description': 'Enable CORS or not'
    },
    'compression': {
      'default': false,
      'description': 'Enable Compression or not'
    },
    'etag': {
      'default': Date.now()
        .toString(16),
      'description': 'Enable Static ETAG or not'
    },
    firebaseApiKey: {
      'default': process.env.FIREBASE_API_KEY || '',
    },
    firebaseAuthDomain: {
      'default': process.env.FIREBASE_AUTH_DOMAIN || '',
    },
    firebaseDatabaseURL: {
      'default': process.env.FIREBASE_DATABASE_URL || '',
    },
    firebaseStorageBucket: {
      'default': process.env.FIREBASE_STORAGE_BUCKET || '',
    },
    firebaseMessagingSenderId: {
      'default': process.env.FIREBASE_MESSAGING_SENDER_ID || '',
    },
    'help': {
      'alias': 'h',
      'description': 'Show Help',
    }
  })
  .argv;

if (config.help)
{
  yargs.showHelp()
  process.exit(1);
}


let app = express();

// disable tech revealing header
app.disable('x-powered-by');
app.disable('etag');

// cross origin api/content access
if (config.cors)
{
  app.use(cors());
}

app.use(function (req, res, next)
{
  res.sendDate = false;
  if (config.etag && req.headers['if-none-match'] === config.etag)
  {
    res.status(304)
      .send()
      .end();
  }
  else
  {
    if (config.etag && req.path && req.path.indexOf('/api') === -1)
    {
      res.header('ETag', config.etag)
        .header('Cache-Control', 'public, max-age=1800');
    }
    res.header('X-XSS-Protection', '1; mode=block');
    res.header('X-Content-Type-Options', 'nosniff');
    res.header('X-Frame-Options', 'SAMEORIGIN');
    next();
  }
});

if (config.compression)
{
  /*eslint no-underscore-dangle: ["error", { "allow": ["_headers"] }]*/
  app.use(compression({
    level: 9,
    filter: (req, res) => typeof res._headers['content-encoding'] === 'undefined',
    threshold: 0
  }));
}

// content
if (config.static)
{
  app.use(express.static(config.static, {
    etag: false,
    lastModified: false
  }));
}

app.firebase = firebase.initializeApp({
  apiKey: config.firebaseApiKey,
  authDomain: config.firebaseAuthDomain,
  databaseURL: config.firebaseDatabaseURL,
  storageBucket: config.firebaseStorageBucket,
  messagingSenderId: config.firebaseMessagingSenderId
});

config.apiPrefix = '/api/v0/';

(async () =>
{
  for (let file of fs.readdirSync(path.join(path.dirname(__filename), 'api')))
  {
    const plugin = require(`./api/${file}`);
    await plugin(app, config);
  }
  app.listen(config.port, () => console.log(`Kemba Joggers is listening on port ${config.port}!`));
})();
