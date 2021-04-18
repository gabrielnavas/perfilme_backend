const { isEmail } = require('../infra/validators')
const userRepository = require('../infra/db/userRepository')

const resultCreate = (errors, userCreated) => ({errors, userCreated})

module.exports = {
  create: async ({name, email, password, passwordConfirmation}) => {
    const errors = []
    const maxPassword = 50
    const minPassword = 6
    if(name.length < 2) {
      errors.push('Nome muito pequeno.')
    }
    if(name.length > 50) {
      errors.push('Nome muito grande.')
    }
    if(!isEmail(email)) {
      errors.push('Email inválido.')
    }
    if(password.length < minPassword) {
      errors.push('Senha muito pequena.')
    }    
    if(password.length > maxPassword) {
      errors.push('Senha muito grande.')
    }    
    if(passwordConfirmation.length < minPassword) {
      errors.push('Confirmação de senha muito pequena.')
    }    
    if(passwordConfirmation.length > maxPassword) {
      errors.push('Confirmação de senha muito grande.')
    }    
    if(password !== passwordConfirmation) {
      errors.push('Senha está diferente da confirmação de senha.')
    }

    const userFound = await userRepository.findByEmail(email)
    if(userFound) {
      errors.push('Usuário já cadastrado.')
    }

    if(errors.length > 0) {
      return resultCreate(errors, null)
    }
    
    const userCreated = await userRepository.insert({name, email, password})
    return resultCreate(errors, userCreated)
  }
}