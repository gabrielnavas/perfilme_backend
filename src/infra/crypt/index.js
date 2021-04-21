const jwt = require('jsonwebtoken')
const env = require('../../env')

const createToken = param => {
  return jwt.sign(param, env.auth.privateKey, {
    expiresIn: '7d'
  })
}

module.exports = { createToken }