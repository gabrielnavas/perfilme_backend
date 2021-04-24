const userRepository = require('../infra/db/userRepository')
const { isEmail } = require('../infra/validators')
const { createToken } = require('../infra/crypt')
const { compare } = require('../infra/hashs')

type ResponseData = {
  token?: string
  user?: { name: string }
}

type ResponseError = {
  hasError: boolean
  errors: string[]
}

type ParamsAuth = {
  email: string
  password: string
}

const createTokenUseCase = async ({ email, password }: ParamsAuth): 
  Promise<ResponseError & ResponseData> => {
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
  const userFoundFromRepository = await userRepository.findByEmail(email)
  if(!userFoundFromRepository) {
    errors.push('Conta não cadastrada')
    console.log('n achou email');
  }
  else if(!await compare(password, userFoundFromRepository.password)) {
    console.log('senha errada');
    errors.push('Conta não cadastrada')
  }
  if(errors.length > 0) {
    return {
      errors,
      hasError: true
    }
  }
  const tokenValid = createToken({ id: userFoundFromRepository.id })
  return {
    errors,
    hasError: false,
    token: tokenValid,
    user: { name: userFoundFromRepository.name }
  }
}

export { createTokenUseCase }