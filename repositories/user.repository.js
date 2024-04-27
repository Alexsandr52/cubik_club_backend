const pool = require('../db')

class UserRepository {
   async createUser({ login, hashedPassword, role }) {
      const responce = await pool.query("INSERT INTO users (login, password, role) VALUES ($1, $2, $3) RETURNING *", [login, hashedPassword, role]);

      return responce.rows[0];
   }

   async getUserData(login) {
      const responce = await pool.query("SELECT * FROM users WHERE login=$1", [login]);

      if (!responce.rows.length) {
         return null
      }

      return responce.rows[0];
   }
}

module.exports = new UserRepository()