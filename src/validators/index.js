const validator = require('validator')

const isEmail = email => validator.isEmail(email)

module.exports = { isEmail }