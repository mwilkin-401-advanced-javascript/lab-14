'use strict';


/**
 * @module 500_server_error
 */

/**
  * 
  * @param {object} err - error object
  * @param {object} req - request object
  * @param {object} res - response object
  * @desc server error handler - error 500
  * 
  */

module.exports = (err, req, res, next) => {
  console.log('__SERVER_ERROR__', err);
  let error = { error: err.message || err };
  res.status(500).json(error);
};
