'use strict';

/**
 * API Router Module
 * @module router
 */

const express = require('express');
const authRouter = express.Router();

const User = require('./users-model.js');
const Role = require('./roles-model.js');
const auth = require('./middleware.js');
const oauth = require('./oauth/google.js');


/**
 * post route assign role
 * @route POST /{role}
 * @method post
 * @consumes application/json application/xml
 * @param req - request
 * @param res - response
 * @param next - middle
 * @returns {Object} 500 - Server error
 * @returns {Object} 200 - { count: 1, result: {}}
 */

authRouter.post('/role', (req, res, next) => {
  let role = new Role(req.body);
  role.save()
    .then(result => {
      res.status(200).send(result);
    })
    .catch(next);
});

/**
 * signup user
 * @route POST /{signup}
 * @method post
 * @consumes application/json application/xml
 * @param req - request
 * @param res - response
 * @param next - middleware
 * @returns {Object} 500 - Server error
 * @returns {Object} 200 - adds new user and token to request object
 */

authRouter.post('/signup', (req, res, next) => {
  let user = new User(req.body);
  user.save()
    .then( (user) => {
      req.token = user.generateToken();
      req.user = user;
      res.set('token', req.token);
      res.cookie('auth', req.token);
      res.send(req.token);
    })
    .catch(next);
});

/**
 * signin user
 * @route POST /{signin}
 * @method get
 * @consumes application/json application/xml
 * @param req - request
 * @param res - response
 * @param next - middleware
 * @returns {Object} 500 - Server error
 * @returns {Object} 200 - signs in user, validates and adds a token to request
 */

authRouter.get('/signin', auth(), (req, res, next) => {
  res.cookie('auth', req.token);
  res.send(req.token);
});

/**
 * oauth user
 * @route GET /{oauth}
 * @method get
 * @consumes application/json application/xml
 * @param req - request
 * @param res - response
 * @param next - middleware
 * @returns {Object} 500 - Server error
 * @returns {Object} 200 - valid user using google oauth signin
 */

authRouter.get('/oauth', (req,res,next) => {
  oauth.authorize(req)
    .then( token => {
      res.status(200).send(token);
    })
    .catch(next);
});

/**
 * Saves a user key(token)
 * @route POST /{key}
 * @method post
 * @consumes application/json application/xml
 * @returns {Object} 500 - Server error
 * @returns {Object} 200 - generates key and sends it
 */

authRouter.post('/key', auth, (req,res,next) => {
  let key = req.user.generateKey();
  res.status(200).send(key);
});

/**
 * Export object with authrouter
 * @type {Object}
 */

module.exports = authRouter;
