const jwtHelper = require('../helpers/jwt.helper');
const debug = console.log.bind(console);

const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET || "access-token-secret-chinh";

let isAuth = async (req, res, next) => {
  const tokenFromClient = req.body?.token || req.query?.token || req.headers["x-access-token"];
  console.log("Token from client: ", tokenFromClient);
  if (tokenFromClient) {
    try {
      const decoded = await jwtHelper.verifyToken(tokenFromClient, accessTokenSecret);
      req.jwtDecoded = decoded
      next()
    } catch (error) {
      debug("Error in isAuth middleware: ", error);
      return res.status(401).json({
        message: "Unauthorized! Invalid token",
      })
    }
  } else {
    return res.status(403).json({
      message: "No token provided!",
    })
  }
}

module.exports = { isAuth }