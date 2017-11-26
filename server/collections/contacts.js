"use strict";

const parseFilters = require('node-user-accounts-boilerplate/filters/parse');
const request = require('../misc/request');

module.exports = Object.assign({}, require('./default'));

async function tidyhq(context, req)
{
  const path = 'https://api.tidyhq.com/v1' + req.path + (req.path.indexOf('?') !== -1 ? '&' : '?') + `access_token=${context.accessToken}`;
  return await req.request(path, req.body);
}

async function update(collection, update)
{
  try
  {
    const entity = await collection.readRecord(record);
    for (let field in update)
    {
      if (field != 'id')
      {
        entity[field] = update[field];
      }
    }
    await collection.updateRecord(entity);
  } catch (e) {
    await collection.createRecord(update);
  }
}

module.exports.search = async function (context, collection, req, res)
{
  const query = parseFilters(collection.searchMeta, req.query);
  const results = await tidyhq(context, {
    request: request.read,
    path: `/contacts?offset=${query.offset}&limit=${query.limit}&search_terms=${req.query.query || ''}`
  })
  await Promise.all(results.map(update.bind(null, collection)));
  res.json({results});
};

module.exports.create = async function (context, collection, req, res)
{
  res.json('BEN SAYS NOT FOR THIS!!');
};

module.exports.read = async function (context, collection, req, res)
{
  const result = await tidyhq(context, {
    request: request.read,
    path: `/contacts/${parseInt(req.params.id)}`
  });
  update(collection, result);
  res.json(result);
};

module.exports.update = async function (context, collection, req, res)
{
  try
  {
    const entity = await collection.readRecord(req.params);
    const update = req.body;
    for (let field in update)
    {
      if (field != 'id')
      {
        entity[field] = update[field];
      }
    }
    await collection.updateRecord(entity);
    // TODO: update record
    res.json("updated");
  }
  catch (err)
  {
    console.log('ERROR', err);
    res.error(err);
  }
};

module.exports.searchMeta = {
  fields: {
   "firstName": {},
   "lastName": {},
   "memberId": {},
  }
}
