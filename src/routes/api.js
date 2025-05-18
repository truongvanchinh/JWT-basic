const express = require('express');
const router = express.Router();

const AuthController = require('../controllers/AuthController');
const FriendController = require('../controllers/FriendController');
const AuthMiddleware = require('../middleware/AuthMiddleware');

let initAPI = (app) => {
  router.post('/api/login', AuthController.login);
  router.post('/api/refresh-token', AuthController.refreshToken);

  router.get('/api/friends', AuthMiddleware.isAuth, FriendController.friendList);

  return app.use('/', router);
}

module.exports = initAPI