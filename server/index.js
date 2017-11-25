"use strict";

const yargs = require('yargs');

const express = require('express');
const cors = require('cors');
const compression = require('compression');

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

app.listen(config.port, () => console.log(`Kemba Joggers is listening on port ${config.port}!`));
