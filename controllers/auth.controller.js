const authService = require('../services/auth.service')

class AuthController {

   async registration(req, res) {
      const { login, password } = req.body;
      // const { fingerprint } = req;

      try {
         const { accessToken, refreshToken, accessTokenExpiration } = await authService.registration({ login, password });

         return res.status(200).json({ accessToken, refreshToken, accessTokenExpiration })
      } catch (e) {
         if (e.status) {
            return res.status(e.status).json({ error: e.error })
         }
         console.log(e);
         return res.status(400).json({ error: "Ошибка регистрации." })
         // TODO: ErrorCatcher with error responce to client
      }
   }

   async login(req, res) {
      const { login, password } = req.body;

      try {
         const { accessToken, refreshToken, accessTokenExpiration } = await authService.login({ login, password });

         return res.status(200).json({ accessToken, refreshToken, accessTokenExpiration })
      } catch (e) {
         if (e.status) {
            return res.status(e.status).json({ "error": e.error })
         }
         return res.status(400).json({ "error": "Ошибка входа в аккаунт." })
         // TODO: ErrorCatcher with error responce to client
      }
   }

   async logout(req, res) {
      const refreshToken = req.refreshToken;

      try {
         await authService.logout(refreshToken);

      } catch (e) {
         return res.status(e.status || 500).json(e.error);
      }
   }

   async refresh(req, res) {
      const currentRefreshToken = req.refreshToken;


      try {
         const { accessToken, refreshToken, accessTokenExpiration } =
            await authService.refresh({
               currentRefreshToken
            })

         return res.sendStatus(200).json({ accessToken, refreshToken, accessTokenExpiration });
      } catch (e) {
         return res.status(e.status || 500).json(e.error);
      }
   }

}

module.exports = new AuthController()