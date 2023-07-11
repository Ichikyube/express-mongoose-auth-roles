const { sign } = require('jsonwebtoken');

// create json web token
// ----------------------------------
const maxAge = 3 * 24 * 60 * 60;
const createAccessToken = user => {
  return sign({
    user: {
        username: user.username,
        email: user.email,
        id: user.id,
    },
  }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: '15m',
  });
};

const createRefreshToken = userId => {
  return sign({
    user: {
        username: user.username,
        email: user.email,
        id: user.id,
    },
  }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: '7d',
  });
};

function tokenForUser(user) {
  const timestamp = new Date().getTime();
  return jwt.encode({
      sub: user.id,
      iat: timestamp
  }, process.env.secret);
}

const generateToken = (payload) => {
  const accessToken = createAccessToken(payload);
  const refreshToken = createRefreshToken(payload);
  return { accessToken, refreshToken };
};

// Send tokens
// ----------------------------------
const sendAccessToken = (res, req, accesstoken) => {
  res.send({
    accesstoken,
    email: req.body.email,
  });
};

const sendRefreshToken = (res, token) => {
  res.cookie('refreshtoken', token, {
    httpOnly: true,
    path: '/refresh_token',
  });
};

module.exports = {
  createAccessToken,
  createRefreshToken,
  sendAccessToken,
  sendRefreshToken
};