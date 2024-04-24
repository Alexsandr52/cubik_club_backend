const Pool = require('pg').Pool

const pool = new Pool({
   user: "postgres",
   password: ".!.Postgresql.HomE.1524334251.!.",
   host: "localhost",
   port: 5432,
   database: "cubik_database"
})

module.exports = pool
