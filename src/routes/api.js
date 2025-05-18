import express from 'express';
import jwt from 'jsonwebtoken';
import AuthMiddleware from '../middleware/AuthMiddleware.js';
import jwtHelpers from '../helpers/jwt.helper.js';

const router = express.Router();
const posts = [
  {
    id: 1,
    username: 'user1',
    title: 'Post 1',
    content: 'This is the content of post 1',
  },
  {
    id: 2,
    username: 'user2',
    title: 'Post 2',
    content: 'This is the content of post 2',
  },
];

const tokenList = {}

const initAPI = (app) => {
  router.get('/posts', AuthMiddleware.isAuth, (req, res) => {
    res.json(posts.filter(post => post.username === req.user.name));
  })

  router.post('/login', async (req, res) => {
    const { username } = req.body;

    const user = { name: username };
    const accessToken = await jwtHelpers.generateToken(user, process.env.ACCESS_TOKEN_SECRET, process.env.ACCESS_TOKEN_LIFE);
    const refreshToken = await jwtHelpers.generateToken(user, process.env.REFRESH_TOKEN_SECRET, process.env.REFRESH_TOKEN_LIFE);

    // Store the refresh token in the database (or in-memory store)
    tokenList[refreshToken] = { accessToken, refreshToken };

    return res.status(200).json({ accessToken, refreshToken });
  })

  router.post('/refresh-token', async (req, res) => {
    const refreshToken = req.body.refreshToken;
    if (refreshToken && tokenList[refreshToken]) {
      try {
        const decoded = await jwtHelpers.verifyToken(refreshToken, process.env.REFRESH_TOKEN_SECRET);
        const user = { name: decoded.name };
        const accessToken = await jwtHelpers.generateToken(user, process.env.ACCESS_TOKEN_SECRET, process.env.ACCESS_TOKEN_LIFE);
        return res.status(200).json({ accessToken });
      } catch (error) {
        return res.status(403).json({ message: 'Invalid refresh token' });
      }
    } else {
      return res.status(403).json({ message: 'Refresh token not found' });
    }
  })

  app.use('/', router);
}

export default initAPI;