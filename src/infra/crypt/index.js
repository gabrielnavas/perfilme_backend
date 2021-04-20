const jwt = require('jsonwebtoken')
const env = require('../../env')

const createToken = param => {
  return jwt.sign(param, env.auth.privateKey, {
    expiresIn: 1,
  })
}

module.exports = { createToken }