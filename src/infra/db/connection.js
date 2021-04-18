const pg = require('pg-promise')
const env = require('../../env')


const pgp = pg({})({
  host: env.database.host,
  port: env.database.port,
  database: env.database.database,
  password: env.database.password,
  user: env.database.userName,
})

module.exports = { clientConnection: pgp }