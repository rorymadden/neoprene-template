'use strict';

// users.js
// Routes to CRUD users.

var User = require('../models/user');

/**
 * GET /users
 */
exports.list = function (req, res) {
  User.find(function (err, users) {
    if (err) return next(err);
    res.json(200, users);
  });
};

/**
 * POST /users
 */
exports.create = function (req, res) {
  // would add some validation here
  var user = new User({
    first: req.body.first,
    last: req.body.last,
    email: req.body.email,
    gender: req.body.gender
  });

  user.create(function(err, user){
    if(err) return res.json(500, err);
    else return res.json(200, user);
  });
};

/**
 * GET /users/:id
 */
exports.show = function (req, res) {
  var response = {};
  User.findById(req.params.id, function (err, user) {
    if (err) return res.json(412, err);
    response.user = user;
    user.getAllRelationships('Follows', function (err, results) {
      if (err) return res.json( 500, err);
      // TODO need followers, following and others
      response.results = results;
      return res.json(200, response);
    });
  });
};

/**
 * POST /users/:id
 */
exports.edit = function (req, res) {
  User.findByIdAndUpdate(req.params.id, req.body, function(err, user){
    if(err) return res.json(500, err);
    else return res.json(200, user);
  });
};

/**
 * DELETE /users/:id
 */
exports.del = function (req, res) {
  User.findByIdAndRemove(req.params.id, {remove: {force: true}}, function(err){
    if(err) return res.json(500, err);
    else return res.json(200);
  });
};

/**
 * POST /users/:id/follow
 */
exports.follow = function (req, res) {
  var relationship = {
    from: parseInt(req.params.id, 10),
    fromType: 'User',
    to: parseInt(req.body._id, 10),
    toType: 'User',
    type: 'Follows'
  };
  User.createRelationship(relationship, function (err, rel) {
    if(err) return res.json(500, err);
    else return res.json(200, rel);
  });
};

/**
 * POST /users/:id/unfollow
 */
exports.unfollow = function (req, res) {
  var relationship ={
    rel: req.body.relId,
    fromType: 'User',
    toType: 'User'
  };
  User.removeRelationship(relationship, function (err) {
    if(err) return res.json(500, err);
    else return res.json(200);
  });
};
