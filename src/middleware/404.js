'use strict';

/**
 * @module 404_server_error
 */

/**
  * 
  * @param {object} req - request object
  * @param {object} res - response object
  * @param {object} next - middleware 
  * @desc resource not found server error handler - error 404
  * 
  */

module.exports = (req,res,next) => {
  let error = { error: 'Resource Not Found' };
  res.status(404).json(error);
};
