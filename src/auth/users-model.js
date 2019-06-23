'use strict';

/**
 * @module users-model
 */

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('./roles-model.js');

const SINGLE_USE_TOKENS = !!process.env.SINGLE_USE_TOKENS;
const TOKEN_EXPIRE = process.env.TOKEN_LIFETIME || '5m';
const SECRET = process.env.SECRET || 'foobar';

const usedTokens = new Set();

// eslint-disable-next-line no-unused-vars
const capabilities = {
  admin: ['create','read','update','delete', 'superuser'],
  editor: ['create', 'read', 'update'],
  user: ['read'],
};

/**
* @schema users
* @desc users mongoose schema
 */

const users = new mongoose.Schema({
  username: {type:String, required:true, unique:true},
  password: {type:String, required:true},
  email: {type: String},
  role: {type: String, default:'user', enum: ['admin','editor','user', 'superuser']}}, { toObject:{virtuals:true}, toJSON:{virtuals:true} });

/**
 * @method virtual
 * @desc Users virtual
 */


users.virtual('acl', {
  ref: 'roles',
  localField: 'role',
  foreignField: 'role',
  justOne:true,
});

/**
 * @method pre-findOne
 * @desc Before findOne, the acl table is populated with users roles
 */

users.pre('findOne', function() {
  try{
    this.populate('acl');
  }
  catch(e) {
    console.error('error', e);
  }
});

/**
 * @method pre-save
 * @desc Before save, hashing password
 */

users.pre('save', function(next) {
  bcrypt.hash(this.password, 10)
    .then(hashedPassword => {
      this.password = hashedPassword;
      next();
    })
    .catch(error => {throw new Error(error);});
});

/**
 *   @method createFromOauth
 * @param {Object} googleUser - passed in user info from google
 * @desc Create From Oauth function takes in a google users info and creates a user
 */

users.statics.createFromOauth = function(googleUser) {

  if(! googleUser) { return Promise.reject('Validation Error'); }
  let email = googleUser.email;
  return this.findOne( {email} )
    .then(user => {
      if( !user ) { throw new Error('User Not Found'); }
      return user;
    })
    .catch( error => {
      let username = email;
      let password = 'none';
      let role = 'user';
      return this.create({username, password, email, role});
    });

};

/**
 * @method authenticateToken
 * @param {Object} token - passed in token
 * @desc Runs checks to see if current token exists, is a key, is valid, if it isn't a key it dequalifies it after use
 */

users.statics.authenticateToken = function(token) {
  
  if ( usedTokens.has(token ) ) {
    return Promise.reject('Invalid Token');
  }
  
  try {
    let parsedToken = jwt.verify(token, SECRET);
    (SINGLE_USE_TOKENS) && parsedToken.type !== 'key' && usedTokens.add(token);
    let query = {_id: parsedToken.id};
    return this.findOne(query);
  } catch(e) { throw new Error('Invalid Token'); }
  
};

/**
 * @method authenticateBasic
 * @param {Object} auth - passed in authenticated user info
 * @desc Checks to see if current user is in database and is using password associated with that user
 */

users.statics.authenticateBasic = function(auth) {
  let query = {username:auth.username};
  return this.findOne(query)
    .then( user => user && user.comparePassword(auth.password) )
    .catch(error => {throw error;});
};

/**
 *   @method authenticateBearer
   * @param {object} token - passed in token
   * @desc Checks to see if current token is valid and can be used
   */

users.statics.authenticateBearer = function(token){
  if(usedTokens.has(token)){
    return Promise.reject('Invalid token');
  }

  let parsedToken = jwt.verify(token, process.env.SECRET);
  parsedToken.type !== 'key' && usedTokens.add(token);

  let query = {_id: parsedToken.id};
  return this.findOne(query);
};

/**
 * @method comparePassword
 * @param {Object} password - users password
 * @desc Uses bcrypt to compare passed in password to one stoted in the database
 */


users.methods.comparePassword = function(password) {
  return bcrypt.compare( password, this.password )
    .then( valid => valid ? this : null);
};

/**
 * @method generateToken
 * @param {Object} type - type of user
 * @desc generates a token if valid with an associated capability. 
 */

users.methods.generateToken = function(type) {
  
  let token = {
    id: this._id,
    capabilities: this.acl.capabilities,
    type: type || 'user',
  };
  
  let options = {};
  if ( type !== 'key' && !! TOKEN_EXPIRE ) { 
    options = { expiresIn: TOKEN_EXPIRE };
  }
  
  return jwt.sign(token, SECRET, options);
};

/**
 * @method can
 * @param {Object} capability - users capability
 * @desc checks to see if the passed in capablity has a certain role
 */

users.methods.can = function(capability) {
  return this.acl.capabilities.includes(capability);
};

/**
 * @method generateKey
 * @desc generates a key
 */

users.methods.generateKey = function() {
  return this.generateToken('key');
};

/**
 * Export object
 * @type {Object} - users
 */

module.exports = mongoose.model('users', users);
