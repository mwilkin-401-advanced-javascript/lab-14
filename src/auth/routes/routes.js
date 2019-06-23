'use strict';

/**
 * Routes Module
 * @module routes
 */

const express = require('express');
const User = require('../users-model.js');
const Role = require('../roles-model.js');
const auth = require('../middleware.js');
const oauth = require('../oauth/google.js');

const newRouter = express.Router();
const capabilities = {
  admin: ['create','read','update','delete', 'superuser'],
  editor: ['create', 'read', 'update'],
  user: ['read'],
};

/**
 * post route assign role
 * @route POST /{role}
 * @consumes application/json application/xml
 * @returns {Object} 500 - Server error
 * @returns {Object} 200 - assigns roles to users capabilities
 */

newRouter.post('/role', (req, res) => {
  let saves = [];
  Object.keys(capabilities).map(role => {
    let newRecord = new Role({role, capabilities: capabilities[role]});
    saves.push(newRecord.save());
  });
  Promise.all(saves);
  res.status(200).send('Roles created');
});

// newRouter.post('/role', (req, res, next) => {
//   let role = new Role(req.body);
//   role.save()
//     .then(result => {
//       res.status(200).send(result);
//     })
//     .catch(next);
// });

/**
 * get route public-stuff
 * @route GET /{public-stuff}
 * @consumes nothing
 * @returns {Object} 500 - Server error
 * @returns {Object} 200 - returns success message
 */

newRouter.get('/public-stuff', (req, res, next) => {
  res.status(200).send('Public message for you');
});

/**
 * get route hidden-stuff
 * @route GET /{hidden-stuff}
 * @consumes nothing
 * requires basic auth
 * @returns {Object} 500 - Server error
 * @returns {Object} 200 - returns success message
 */

newRouter.get('/hidden-stuff', auth(), (req, res, next) => {
  res.status(200).send('Hidden stuff is supposed to be hidden!');
});

/**
 * get route something-to-read
 * @route GET /{something-to-read}
 * @consumes nothing
 * requires read auth
 * @returns {Object} 500 - Server error
 * @returns {Object} 200 - returns success message
 */

newRouter.get('/something-to-read', auth('read'), (req, res, next) => {
  res.send(200).send('Riddle me this...');
});

/**
 * post route create-a-thing
 * @route POST /{create-a-thing}
 * @consumes nothing
 * requires create auth
 * @returns {Object} 500 - Server error
 * @returns {Object} 200 - returns success message
 */

newRouter.post('/create-a-thing', auth('create'), (req, res, next) => {
  res.send(200).send('you created a monster');
});

/**
 * put route update
 * @route PUT /{update}
 * @consumes nothing
 * requires update auth
 * @returns {Object} 500 - Server error
 * @returns {Object} 200 - returns success message
 */

newRouter.put('/update', auth('update'), (req, res, next) => {
  res.send(200).send('you updated a thing');
});

/**
 * patch route jp
 * @route PATCH /{jp}
 * @consumes nothing
 * requires update auth
 * @returns {Object} 500 - Server error
 * @returns {Object} 200 - returns success message
 */

newRouter.patch('/jp', auth('update'), (req, res, next) => {
  res.send(200).send('patch jp');
});

/**
 * delete route bye-bye
 * @route DELETE /{bye-bye}
 * @consumes nothing
 * requires delete auth
 * @returns {Object} 500 - Server error
 * @returns {Object} 200 - returns success message
 */

newRouter.delete('/bye-bye', auth('delete'), (req, res, next) => {
  res.send(200).send('thing deleted');
});

/**
 * get route everything
 * @route GET /{everything}
 * @consumes nothing
 * requires superuser auth
 * @returns {Object} 500 - Server error
 * @returns {Object} 200 - returns success message
 */

newRouter.get('/everything', auth('superuser'), (req, res, next) => {
  res.send(200).send('superuse get');
});
