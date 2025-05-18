import jwt from 'jsonwebtoken'
import 'dotenv/config'

const isAuth = (req, res, next) => {
  try {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
      if (err) {
        return res.sendStatus(403)
      }
      req.user = user
      next()
    })
    
  } catch (error) {
    res.status(401).json({ message: 'Unauthorized' });
  }
}

export default {
  isAuth
};