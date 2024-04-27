const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');

class TokenService {
   async verifyRefreshToken(refreshToken) {
      return await jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
   }

   async verifyAccessToken(accessToken) {
      return await jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
   }

   async generateAccessToken(payload) {
      return await jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
         expiresIn: "30m",
      });
   }

   async generateRefreshToken(payload) {
      return await jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {
         expiresIn: "30d",
      });
   }

   async checkAccess(req, _, next) {
      const authHeader = req.headers.authorization;

      const token = authHeader?.split(" ")?.[1];

      if (!token) {
         return next(401);
      }

      jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (error, user) => {
         if (error) {
            return next(403, { "error": error });
         }

         req.user = user;
         next();
      });

   }
}

module.exports = new TokenService()