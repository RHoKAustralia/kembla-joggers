const parseFilters = require('node-user-accounts-boilerplate/filters/parse');
const json = require('body-parser')
  .json();

function setup(context, collectionName)
{
  console.log(collectionName)
  let app = context.express();
  context.app.use(context.apiPrefix + '/' + collectionName, app);

  const users = context.users;
  const collection = context[collectionName];

  const createSchema = validator({type: 'object'});
  const updateSchema = validator({type: 'object'});
  // const lookup = cachedCollectionLookup(collection);

  function search(req, res)
  {
    const query = parseFilters(collection.searchMeta, req.query);
    collection.searchRecords(query)
      .then(results =>
      {
        res.status(200)
          .json(results)
          .end();
      });
  }

  async function create(req, res)
  {
    const entity = req.body;
    if (!entity.id || collection.lookup[entity.id] !== undefined)
    {
      entity.id = collection.getNewId(entity.name);
    }
    await collection.createRecord(entity);
    return res.resolve(promises, {
      success: "Created",
      id: entity.id
    });
  }

  async function read(req, res)
  {
    res.json(await collection.readRecord(req.params));
  }

  function update(req, res)
  {
    // try
    // {
    //   const entity = req.body;
    //   const existing = req.record;
    //   for (let field in entity)
    //   {
    //     collection.updateField(existing, field, entity[field]);
    //   }
    //   res.resolve(collection.updateRecord(existing), "updated");
    // }
    // catch (err)
    // {
    //   console.log('ERROR', err);
    //   res.error(err);
    // }
  }

  function delete_(req, res)
  {
    res.resolve(collection.deleteRecord(req.params), "deleted");
  }

  // wire up express
  app.search('*', access, search);
  app.all('/search.json', access, search);
  app.get('/:id.json', access, read);
  app.post('*', json, access, create);
  app.put('/:id.json', access, json, updateSchema, update);
  app.patch('/:id.json', access, json, updateSchema, update);
  app.delete('/:id.json', access, delete_);
};

/**
 * express middleware for create access check
 */
function access(req, res, next)
{
  return next();
  if (req.user && req.user.id)
  {
    return next();
  }
  res.status(403)
    .json({
      error: 'No acccess =/'
    });
}

const Ajv = require('ajv');
const ajv = new Ajv({
  unknownFormats: ['password'],
});

/**
 * Validates JSON body given schema.
 *
 * AJV is used for validation.
 *
 * @param {object} schema JSON schema to validate with
 * @return {ExpressMiddleware}
 */
function validator(schema)
{
  const validate = ajv.compile(schema);
  return function (req, res, next)
  {
    if (!validate(req.body))
    {
      console.log(validate.errors, req.body);
      res.status(400)
        .json({
          error: `Invalid Payload: ${validate.errors.map(err => err.schemaPath + ": " + err.message).join('; ')}`
        });
    }
    else
    {
      next();
    }
  };
}


module.exports = function(context)
{
  for (let collection of ['contacts', 'events', 'races', 'courses'])
  {
    setup(context, collection);
  }
}

process.on('unhandledRejection', function (reason, p)
{
  console.log("Possibly Unhandled Rejection at: Promise ", p, " reason: ", reason);
  // application specific logging here
});
