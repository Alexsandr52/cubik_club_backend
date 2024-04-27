const bcrypt = require('bcrypt')
const userRepository = require("../repositories/user.repository")
const tokenService = require('./token.service')
const refreshSessionsRepository = require('../repositories/refresh_sessions.repository')
const constants = require('../constants')

class AuthService {
   async registration({ login, password, role }) {
      const userData = await userRepository.getUserData(login)

      if (userData) {
         throw { status: "409", error: "Пользователь с таким именем уже существует" }
      }

      const hashedPassword = bcrypt.hashSync(password, 8)

      const { id } = await userRepository.createUser({ login, hashedPassword, role })

      const payload = { id, login, role };
      const accessToken = await tokenService.generateAccessToken(payload);
      const refreshToken = await tokenService.generateRefreshToken(payload);

      await refreshSessionsRepository.createRefreshSession({ id, refreshToken });

      return { accessToken, refreshToken, accessTokenExpiration: constants.ACCESS_TOKEN_EXPIRATION, }
   }

   async login({ login, password }) {
      const userData = await userRepository.getUserData(login);

      if (!userData) {
         throw { status: 404, error: "Пользователь не найден" }
      }

      const isPasswordValid = bcrypt.compareSync(password, userData.password);

      if (!isPasswordValid) {
         throw { status: 401, error: "Неверный логин или пароль" }
      }

      const payload = { id: userData.id, role: userData.role, login }

      const accessToken = await tokenService.generateAccessToken(payload);
      const refreshToken = await tokenService.generateRefreshToken(payload);

      await refreshSessionsRepository.createRefreshSession({
         id: userData.id, refreshToken
      })

      return {
         accessToken, refreshToken,
         accessTokenExpiration: constants.ACCESS_TOKEN_EXPIRATION
      }
   }

   async logout(refreshToken) {
      await refreshSessionsRepository.deleteRefreshSession(refreshToken);
   }

   async refresh({ currentRefreshToken }) {
      if (!currentRefreshToken) {
         throw { status: 401, error: "Unauthorized" }
      }

      const refreshSession = await refreshSessionsRepository.getRefreshSession(currentRefreshToken);

      if (!refreshSession) {
         throw { status: 401, error: "Unauthorized" }
      }

      await refreshSessionsRepository.deleteRefreshSession(currentRefreshToken);

      let payload;
      try {
         payload = await tokenService.verifyRefreshToken(currentRefreshToken);
      } catch (error) {
         throw { status: 403, error: "Forbidden" }
      }

      const {
         id,
         role,
         login: login,
      } = await userRepository.getUserData(payload.login);

      const actualPayload = { id, login, role }

      const accessToken = await tokenService.generateAccessToken(actualPayload);
      const refreshToken = await tokenService.generateRefreshToken(actualPayload);

      await refreshSessionsRepository.createRefreshSession({
         id,
         refreshToken
      })

      return {
         accessToken, refreshToken,
         accessTokenExpiration: constants.ACCESS_TOKEN_EXPIRATION,
      }
   }
}

module.exports = new AuthService()