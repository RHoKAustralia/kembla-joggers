"use strict";

const parseFilters = require('node-user-accounts-boilerplate/filters/parse');

function getNewId(collection)
{
 for (let x = Date.now(); ; x++)
 {
   if (collection.lookup[x])
   {
     continue
   }
   return x + '';
 }
}

module.exports = {
  create: async function create(context, collection, req, res)
  {
    const entity = req.body;
    if (!entity.id || collection.lookup[entity.id])
    {
      entity.id = getNewId(collection);
    }
    await collection.createRecord(entity);
    res.json({
      success: "Created",
      id: entity.id
    });
  },

  read: async function read(context, collection, req, res)
  {
    res.resolve(collection.readRecord(req.params));
  },

  update: async function (context, collection, req, res)
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
      res.resolve(collection.updateRecord(entity), "updated");
    }
    catch (err)
    {
      console.log('ERROR', err);
      res.error(err);
    }
  },

  delete: function (context, collection, req, res)
  {
    res.error('NEVER!');
    // res.resolve(collection.deleteRecord(req.params), "deleted");
  },

  search: function (context, collection, req, res)
  {
    const query = parseFilters(collection.searchMeta, req.query);
    collection.searchRecords(query)
      .then(results =>
      {
        res.status(200)
          .json(results);
      });
  },

  schema: {
    type: 'object',
    requiredProperties: ''
  },

  searchMeta: {

  }
}
