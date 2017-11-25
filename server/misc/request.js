"use strict";

var jar = require('request')
  .jar()

const request_ = require('request')
  .defaults({
    pool: {
      maxSockets: 1
    },
    forever: true,
    jar: jar
  });

function request(method, url, body = undefined)
{
  console.log(method, url);
  const start = Date.now();
  return new Promise((resolve, reject) =>
  {
    request_({
      method: method,
      url: url,
      gzip: true,
      json: true,
      headers: {
        'accept-encoding': 'gzip'
      },
    }, (err, response, body) =>
    {
      if (!err && response && response.statusCode === 200)
      {
        try
        {
          const end = Date.now();
          console.log(method, url, response.statusCode, end - start);
          resolve(body);
          return;
        }
        catch (e)
        {
          console.error(e)
          err = e
        }
      }
      console.error('GET', url, err, response && response.statusCode, body);
      reject();
    });
  });
}

module.exports.create = function()
{
  return request.apply(null, ['POST'].concat(Array.prototype.slice.call(arguments)));
}

module.exports.read = function()
{
  return request.apply(null, ['GET'].concat(Array.prototype.slice.call(arguments)));
}

module.exports.update = function ()
{
  return request.apply(null, ['PUT'].concat(Array.prototype.slice.call(arguments)));
}

module.exports.delete = function ()
{
  return request.apply(null, ['DELETE'].concat(Array.prototype.slice.call(arguments)));
}

module.exports.search = function ()
{
  return request.apply(null, ['SEARCH'].concat(Array.prototype.slice.call(arguments)));
}
