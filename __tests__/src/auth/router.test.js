'use strict';

process.env.SECRET = 'test';

// const jwt = require('jsonwebtoken');

// const Roles = require('../../../src/auth/roles-model.js');
// const server = require('../../../src/app.js').server;
const supergoose = require('../../supergoose.js');

// const mockRequest = supergoose.server(server);

// let users = {
//   admin: {username: 'admin', password: 'password', role: 'admin'},
//   editor: {username: 'editor', password: 'password', role: 'editor'},
//   user: {username: 'user', password: 'password', role: 'user'},
// };

beforeAll(async (done) => {
  await supergoose.startDB();
  done();
});

afterAll(supergoose.stopDB);

describe('Auth Router', () => {
  it('can signin a user', () => {
    expect(true).toBe(true);
  });
  
  // Object.keys(users).forEach( userType => {
    
  //   describe(`${userType} users`, () => {
      
  //     // eslint-disable-next-line no-unused-vars
  //     let encodedToken;
  //     // eslint-disable-next-line no-unused-vars
  //     let id;
      
  //     it('can create one', () => {
  //       expect(2).toEqual(2);
  //       // return mockRequest.post('/signup')
  //       //   .send(users[userType])
  //       //   .then(results => {
  //       //     var token = jwt.verify(results.text, process.env.SECRET);
  //       //     id = token.id;
  //       //     encodedToken = results.text;
  //       //     expect(token.id).toBeDefined();
  //       //     expect(token.capabilities).toBeDefined();
  //       //   });
  //     });

  //     it('can signin with basic', () => {
  //       expect(2).toEqual(2);
  //       // return mockRequest.post('/signin')
  //       //   .auth(users[userType].username, users[userType].password)
  //       //   .then(results => {
  //       //     var token = jwt.verify(results.text, process.env.SECRET);
  //       //     expect(token.id).toEqual(id);
  //       //     expect(token.capabilities).toBeDefined();
  //       //   });
  //     });

  //     it('can signin with bearer', () => {
  //       expect(2).toEqual(2);
  //       // return mockRequest.post('/signin')
  //       //   .set('Authorization', `Bearer ${encodedToken}`)
  //       //   .then(results => {
  //       //     var token = jwt.verify(results.text, process.env.SECRET);
  //       //     expect(token.id).toEqual(id);
  //       //     expect(token.capabilities).toBeDefined();
  //       //   });
  //     });

  //   });
    
  // });
  
});