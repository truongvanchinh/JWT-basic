import jwt from 'jsonwebtoken';
import 'dotenv/config';

const generateToken = (user, signatureSecret, tokenLife) => {
  return new Promise((resolve, reject) => {
    jwt.sign(
      { name: user.name },
      signatureSecret,
      { 
        algorithm: 'HS256',
        expiresIn: tokenLife 
      },
      (err, token) => {
        if (err) {
          return reject(err);
        }
        resolve(token);
      }
    );
  });
}
const verifyToken = (token, signatureSecret) => {
  return new Promise((resolve, reject) => {
    jwt.verify(
      token,
      signatureSecret,
      (err, decoded) => {
        if (err) {
          return reject(err);
        }
        resolve(decoded);
      }
    );
  });
}

export default {
  generateToken,
  verifyToken,
};