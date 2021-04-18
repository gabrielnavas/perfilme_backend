const dotenv = require('dotenv')

dotenv.config()

module.exports = {
  server: {
    port: process.env.PORT | 3001
  },
  database: {
    host: process.env.DATABASE_HOST || 'localhost',
    port: Number(process.env.DATABASE_PORT) || 5432,
    database: process.env.DATABASE_NAME || 'postgres',
    userName: process.env.DATABASE_USER_NAME || 'postgres',
    password: process.env.DATABASE_PASSWORD || '123'
  },
  auth: {
    privateKey: process.env.AUTH_PRIVATE_KEY || 'iamprivatekey123!'
  }
}