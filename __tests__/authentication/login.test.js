const supertest = require('supertest')
const app = require('../../src/app')
const { clientConnection } = require('../../src/infra/db/connection')
const userRepository = require('../../src/infra/db/userRepository')

describe('Check usecase errors', () => {
  let request
  let userCreated
  
  beforeAll(async () => {
    await clientConnection.none('DELETE FROM perfilme.user;')
    await clientConnection.none('DELETE FROM perfilme.authentication_token;')
    userCreated = await userRepository.insert({
      email: 'any_wrong_email@email.com',
      password: '123456',
      name: 'any_name'
    })
    request = supertest(app)
  })

  test('should return errors if email is wrong', async () => {
    const params = {
      email: 'any_wrong_email',
      password: '123456'
    }
    const response = await request.post('/auth').send(params)
    expect(response.status).toEqual(400)
    expect(response.body).toEqual(['Email inválido.', 'Conta não cadastrada'])
  })

  test('should return an error if password length is small', async () => {
    const params = {
      email: 'any_wrong_email@email.com',
      password: '123'
    }
    const response = await request.post('/auth').send(params)
    expect(response.status).toEqual(400)
    expect(response.body).toEqual(['Senha muito pequena.', 'Conta não cadastrada'])
  })


  test('should return an error if password length is great', async () => {
    const bigPassword = Array(51).fill('a') 
    const params = {
      email: 'any_wrong_email@email.com',
      password: bigPassword
    }
    const response = await request.post('/auth').send(params)
    expect(response.status).toEqual(400)
    expect(response.body).toEqual(['Senha muito grande.', 'Conta não cadastrada'])
  })


  test('should return a error if account not found', async () => {
    const params = {
      email: 'other_account@email.com',
      password: '123456'
    }
    const response = await request.post('/auth').send(params)
    expect(response.status).toEqual(400)
    expect(response.body).toEqual(['Conta não cadastrada'])
  })
})

describe('Create a token with email and password', () => {
  let request
  let userCreated

  beforeAll(async () => {
    await clientConnection.none('DELETE FROM perfilme.user;')
    await clientConnection.none('DELETE FROM perfilme.authentication_token;')
    userCreated = await userRepository.insert({
      email: 'any_email@email.com',
      password: '123456',
      name: 'any_name'
    })
    request = supertest(app)
  })

  test('should return status 201 and a token', async () => {
    const params = {
      email: userCreated.email,
      password: userCreated.password
    }
    const response = await request.post('/auth').send(params)
    expect(response.status).toEqual(201)
    expect(typeof response.body.token).toEqual('string')
    expect(response.body.token.length).toBeGreaterThan(0)
  })
})


