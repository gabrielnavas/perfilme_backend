const userRepository = require('../infra/db/userRepository')
const { isEmail } = require('../infra/validators')
const { createToken } = require('../infra/crypt')

const resultCreateToken = (errors, tokenValid) => 
  ({ errors, token: tokenValid })

module.exports = async ({ email='', password='' }) => {
  const errors = []
  const maxPassword = 50
  const minPassword = 6
  if(!isEmail(email)) {
    errors.push('Email inválido.')
  }
  if(password.length < minPassword) {
    errors.push('Senha muito pequena.')
  }    
  if(password.length > maxPassword) {
    errors.push('Senha muito grande.')
  }    
  const userFound = await userRepository.findByEmail(email)
  if(!userFound) {
    errors.push('Conta não cadastrada')
  }
  else if(userFound.password !== password) {
    errors.push('Conta não cadastrada')
  }
  if(errors.length > 0) {
    return resultCreateToken(errors, null)
  }
  const tokenValid = createToken({ id: userFound.id })
  return resultCreateToken(errors, tokenValid)
}