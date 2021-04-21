const supertest = require('supertest')
const app = require('../../src/app')
const { clientConnection } = require('../../src/infra/db/connection')
const userRepository = require('../../src/infra/db/userRepository')

describe('Step 01: Check body missing params errors, returning status 400 and erros list', () => {
  let request
  
  beforeAll(async () => {
    request = supertest(app)
  })

  test('should return errors if email is wrong', async () => {
    const params = {
      password: '123456'
    }
    const response = await request.post('/auth').send(params)
    expect(response.status).toEqual(400)
    expect(response.body).toEqual(['missing param: email'])
  })

  test('should return an error if password length is small', async () => {
    const params = {
      email: 'any_wrong_email@email.com',
    }
    const response = await request.post('/auth').send(params)
    expect(response.status).toEqual(400)
    expect(response.body).toEqual(['missing param: password'])
  })
})

describe('Step 02: Check usecase errors, returning status 400 and erros list', () => {
  let request
  
  beforeAll(async () => {
    await clientConnection.none('DELETE FROM perfilme.user;')
    await userRepository.insert({
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

describe('Step 03: Create a token valid if dont have', () => {
  let request

  beforeAll(async () => {
    request = supertest(app)
  })

  afterAll(async () => {
    await clientConnection.none('DELETE FROM perfilme.user;')
  })

  test('should return a token valid from database', async () => {
    await clientConnection.none('DELETE FROM perfilme.user;')
    const userCreated = await userRepository.insert({
      email: 'any_email@email.com',
      password: '123456',
      name: 'any_name'
    })
    const params = {
      email: userCreated.email,
      password: userCreated.password
    }
    const responseAuth = await request.post('/auth').send(params)
    expect(responseAuth.status).toEqual(201)
    expect(typeof responseAuth.body.token).toEqual('string')
    expect(responseAuth.body.token.length).toBeGreaterThan(0)
  })
})
