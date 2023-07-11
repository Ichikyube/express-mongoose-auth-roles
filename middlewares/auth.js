const User = require('../models/user');
const { sign, verify } = require("jsonwebtoken");

function validateTokens(accessToken, refreshToken) {
  try {
    const decodedAccessToken = verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
    const decodedRefreshToken = verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

    return { accessToken: decodedAccessToken, refreshToken: decodedRefreshToken };
  } catch (error) {
      res.status(401);
      throw new Error("User is not authorized");
  }
}
// check current user
const requireAuth = asyncHandler(async (req, res, next) => {
  let authHeader = req.headers.Authorization || req.headers.authorization;
  if (!authHeader) throw new Error('You need to login.');
  if (authHeader && authHeader.startsWith("Bearer")) {
    console.log(authHeader); // Bearer token
    const accessToken = authHeader.split(' ')[1];//req.cookies["access-token"];
    const refreshToken = req.cookies.refreshToken;
    if (!accessToken)
      return res.status(400).json({ error: "User is not authorized or token is missing!" });

    try {
      const validToken = validateTokens(accessToken, refreshToken);
      if (validToken) {
        console.log(decodedToken);
        let user = await User.findById(decodedToken.id).select('-password');
        res.locals.user = user;
        req.authenticated = true;
        return next(user);
      }
    } catch (err) {
      res.locals.user = null;
      console.log(err.message);
      return res.redirect('/login');
      //return res.status(400).json({ error: err });
    }
  }
});

app.get('/protected', requireAuth);

module.exports = { requireAuth, generateToken };


