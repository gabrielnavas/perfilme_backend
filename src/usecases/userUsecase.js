const {isEmail} =require('../validators')
const userRepository = require('../db/userRepository')

const result = (errors, userCreated) => ({errors, userCreated})

module.exports = {
  create: async ({name, email, password}) => {
    const errors = []
    if(name.length < 2) {
      errors.push('Nome muito pequeno.')
    }
    if(name.length > 50) {
      errors.push('Nome muito grande.')
    }
    if(!isEmail(email)) {
      errors.push('Email inválido.')
    }
    if(password.length < 6) {
      errors.push('Senha muito pequena.')
    }    
    if(password.length > 50) {
      errors.push('Senha muito grande.')
    }
    if(errors.length > 0) {
      return result(errors, userCreated)
    }

    const userCreated = await userRepository.insert({name, email, password})
    return result(errors, userCreated)
  }
}