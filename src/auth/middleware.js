'use strict';

const User = require('./users-model.js');

/**
 * middleware Module
 * @module middleware
 * @param capability - user's capability
 */

/**
 * auth export
 * @type {Object}
 */

module.exports = (capability) => {
  
  /**
   * @param {Object} req - request object
   * @param {Object} res - response object
   * @param {Object} next - next function
   * @desc contains all middleware authorization methods
   */

  return (req, res, next) => {

    try {
      let [authType, authString] = req.headers.authorization.split(/\s+/);

      switch (authType.toLowerCase()) {
      case 'basic':
        return _authBasic(authString);
      case 'bearer':
        return _authBearer(authString);
      default:
        return _authError();
      }
    } catch (e) {
      _authError();
    }

    /**
    * @method _authBasic
    * @param {Object} req - request
    * @param {Object} str - string
    * @param {Object} capability - capability
    * @desc Handles creating auth information and calls User.authenticateBasic and handles the return
    */

    function _authBasic(str, capability) {
    // str: am9objpqb2hubnk=
      let base64Buffer = Buffer.from(str, 'base64'); // <Buffer 01 02 ...>
      let bufferString = base64Buffer.toString();    // john:mysecret
      let [username, password] = bufferString.split(':'); // john='john'; mysecret='mysecret']
      let auth = {username, password}; // { username:'john', password:'mysecret' }

      return User.authenticateBasic(auth)
        .then(user => _authenticate(user, capability))
        .catch(_authError);
    }

    /**
    * @method _authBearer
    * @param {Object} req - request
    * @param {Object} authString - user object containing user credentials
    * @param {Object} capability - capabilities
    * @desc Handles authenticating a user and moves onto next middleware or returns and error
    */

    function _authBearer(authString, capability) {
      return User.authenticateToken(authString, capability)
        .then(user => _authenticate(user))
        .catch(_authError);
    }

    // way to secure route if they are a user and don't have a capability assigned
    function _authenticate(user) {
      if ( user && (!capability || (user.can(capability))) ) {
        req.user = user;
        req.token = user.generateToken();
        next();
      }
      else {
        _authError();
      }
    }

    function _authError() {
      next('Invalid User ID/Password');
    }

  };
  
};