const jwtHelper = require("../helpers/jwt.helper");
const debug = console.log.bind(console);

let tokenList = {};

const accessTokenLife = process.env.ACCESS_TOKEN_LIFE || "1h";

const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET || "access-token-secret-chinh";

const refreshTokenLife = process.env.REFRESH_TOKEN_LIFE || "3650d";

const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET || "refresh-token-secret-chinh";

let login = async (req, res) => {
  try {
    debug(`Đang giả lập hành động đăng nhập thành công với Email: ${req.body.email} và Password: ${req.body.password}`)
    debug(`Thực hiện fake thông tin user...`);
    const userFakeData = {
      _id: "1234-5678-910JQK-tqd",
      name: "Chinh",
      email: req.body.email,
    };

    debug(`Thực hiện tạo mã Token, [thời gian sống 1 giờ.]`);
    const accessToken = await jwtHelper.generateToken(userFakeData, accessTokenSecret, accessTokenLife);
    
    debug(`Thực hiện tạo mã Refresh Token, [thời gian sống 10 năm] =))`);
    const refreshToken = await jwtHelper.generateToken(userFakeData, refreshTokenSecret, refreshTokenLife);

    tokenList[refreshToken] = {accessToken, refreshToken};

    debug(`Gửi Token và Refresh Token về cho client...`);
    return res.status(200).json({accessToken, refreshToken});
  } catch (error) {
    return res.status(500).json(error);
  }
}

let refreshToken = async (req, res) => {
  const refreshTokenFromClient = req.body.refreshToken;

  if (refreshTokenFromClient && tokenList[refreshTokenFromClient]) {
    try {
      const decoded = await jwtHelper.verifyToken(refreshTokenFromClient, refreshTokenSecret);
      const userFakeData = decoded.data;
      debug(`Thực hiện tạo mã Token trong bước gọi refresh Token, [thời gian sống vẫn là 1 giờ.]`);
      const accessToken = await jwtHelper.generateToken(userFakeData, accessTokenSecret, accessTokenLife);
      return res.status(200).json({accessToken});
    } catch (error) {
      debug(error)
      res.status(403).json({message: "Invalid refresh token."});
    }
  } else {
    return res.status(403).send({message: "No token provided"});
  }
}

module.exports = {
  login,
  refreshToken,
};