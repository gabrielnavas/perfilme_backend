const { isEmail } = require('../infra/validators')
const userRepository = require('../infra/db/userRepository')
const { updateTokenUserRepository } = require('../infra/db/authenticationUserRepository')
const { createToken } = require('../infra/crypt')


const resultCreateToken = (errors, auth) => ({errors, auth})

module.exports = {
  createToken: async ({ email='', password='' }) => {
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
    const token = await createToken({ id: userFound.id })
    console.log(token);
    await updateTokenUserRepository({
      tokenAuthValid: token, 
      userIdToInvalidateToken: userFound.id
    })

    return resultCreateToken(errors, { token })
  }
}