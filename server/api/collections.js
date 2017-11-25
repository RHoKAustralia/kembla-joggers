const json = require('body-parser')
  .json();
const Ajv = require('ajv');

const collections = require('../collections/index');

function setup(context, collectionName, collectionMethods)
{
  console.log(collectionName)
  let app = context.express();
  context.app.use(context.apiPrefix + '/' + collectionName, app);

  const users = context.users;
  const collection = context[collectionName];

  const createSchema = validator(collectionMethods.schema);
  const updateSchema = validator(collectionMethods.schema);
  // const lookup = cachedCollectionLookup(collection);

  const search = collectionMethods.search.bind(collectionMethods, context, collection);
  const create = collectionMethods.create.bind(collectionMethods, context, collection);
  const read = collectionMethods.read.bind(collectionMethods, context, collection);
  const update = collectionMethods.update.bind(collectionMethods, context, collection);
  const delete_ = collectionMethods.delete.bind(collectionMethods, context, collection);

  // wire up express
  app.search('*', access, search);
  app.all('/search.json', access, search);
  app.get('/:id.json', access, read);
  app.post('*', json, access, createSchema, create);
  app.put('/:id.json', access, json, updateSchema, update);
  app.patch('/:id.json', access, json, updateSchema, update);
  app.delete('/:id.json', access, delete_);
};

/**
 * express middleware for create access check
 */
function access(req, res, next)
{
  return next(); // TODO: remove
  if (req.user && req.user.id)
  {
    return next();
  }
  res.status(403)
    .json({
      error: 'No acccess =/'
    });
}

const ajv = new Ajv({});

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

module.exports = function (context)
{
  for (let collection in collections)
  {
    setup(context, collection, collections[collection]);
  }
}

process.on('unhandledRejection', function (reason, p)
{
  console.log("Possibly Unhandled Rejection at: Promise ", p, " reason: ", reason);
  // application specific logging here
});
