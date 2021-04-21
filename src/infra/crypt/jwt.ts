import jwt from 'jsonwebtoken'
const env = require('../../env')

export const createToken = (param: Object): string => {
  return jwt.sign(param, env.auth.privateKey, {
    expiresIn: '7d'
  })
}
