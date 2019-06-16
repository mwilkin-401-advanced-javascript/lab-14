'use strict';

const express = require('express');
const User = require('../users-model.js');
const Role = require('../roles-model.js');
const auth = require('../middleware.js');
const oauth = require('../oauth/google.js');

const newRouter = express.Router();

const capabilities = {
  admin: ['create', 'read', 'update', 'delete', 'superuser'],
  editor: ['create', 'read', 'update'],
  user: ['read'],
};

newRouter.post('/roles', (req, res, next) => {
  res.status(200).send('initialized roles');
});

newRouter.get('/public-stuff', (req, res, next) => {
  res.status(200).send('Public message for you');
});

newRouter.get('/hidden-stuff', auth(), (req, res, next) => {
  res.status(200).send('Hidden stuff is supposed to be hidden!');
});

newRouter.get('/something-to-read', auth('read'), (req, res, next) => {
  res.send(200).send('Riddle me this...');
});

newRouter.post('/create-a-thing', auth('create'), (req, res, next) => {
  res.send(200).send('you created a monster');
});

newRouter.put('/update', auth('update'), (req, res, next) => {
  res.send(200).send('you updated a thing');
});

newRouter.patch('/jp', auth('update'), (req, res, next) => {
  res.send(200).send('patch jp');
});

newRouter.delete('/bye-bye', auth('delete'), (req, res, next) => {
  res.send(200).send('thing deleted');
});

newRouter.get('/everything', auth('superuser'), (req, res, next) => {
  res.send(200).send('superuse get');
});