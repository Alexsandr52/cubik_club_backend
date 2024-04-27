const pool = require('../db')

class RefreshSessionsRepository {
   async getRefreshSession(refreshToken) {
      const responce = await pool.query("SELECT * FROM refresh_sessions WHERE refresh_token=$1", [refreshToken]);

      if (!responce.rows.length) {
         return null;
      }

      return responce.rows[0];
   }

   async createRefreshSession({ id, refreshToken }) {
      await pool.query("INSERT INTO refresh_sessions (user_id, refresh_token) VALUES ($1, $2)", [id, refreshToken]);
   }

   async deleteRefreshSession(refreshToken) {
      await pool.query("DELETE FROM refresh_sessions WHERE refresh_token=$1", [refreshToken]);
   }

}

module.exports = new RefreshSessionsRepository()