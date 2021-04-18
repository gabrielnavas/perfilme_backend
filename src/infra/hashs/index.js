const {hash: hashBcrypt} = require('bcrypt')

const hash = (plainText='') => {
  const salt = 10
  return hashBcrypt(plainText, salt)
}

module.exports = { hash }