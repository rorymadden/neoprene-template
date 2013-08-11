'use strict';

// user.js
// User model logic.

var neoprene = require('neoprene');
var Schema = neoprene.Schema;
neoprene.connect(process.env.NEO4J_URL || require('../../config').host);

// setup any constants and create the schema
var GENDER = ['unknown', 'male', 'female'];
var UserSchema = new Schema({
  first:{ type: String, required: true, trim: true },
  last:{ type: String, required: true, trim: true },
  email: { type: String, required: true, lowercase: true, trim: true },
  gender: { type: String, required: true, default: 'unknown', enum: GENDER }
});

// create a convenience function for the name
UserSchema
  .virtual('name')
  .get(function () {
    return this.first + ' ' + this.last;
  });

// this returns the name variable when the object is sent to the front end
UserSchema.set('toJSON', { virtuals: true });

// export the new model - which is a node, label User
module.exports = neoprene.model('User', UserSchema);