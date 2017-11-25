"use strict";

module.exports = Object.assign({}, require('./default'));

module.exports.searchMeta = {
  fields: {
    "courseName": {},
    "location": {},
    "surface": {},
    "distance": {},
    "units": {},
    "relayDetails": {},
    "minAge31Dec": 1,
    "handicap": {}
  },
  limit: {
    minimum: 100,
    default: 1000,
    maximum: 1000
  }
}
