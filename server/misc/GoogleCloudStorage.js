"use strict";

const Storage = require('node-collections-boilerplate/storage/Storage');

class GoogleCloudStorage extends Storage
{
  constructor(options = {})
  {
    super(options);


  }
}

module.exports = GoogleCloudStorage
