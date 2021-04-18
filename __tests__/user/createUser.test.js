const supertest = require('supertest')
const app = require('../../src/app')

const { clientConnection } = require('../../src/infra/db/connection')

describe('User Post', () => {
  let request

  beforeEach(async () => {
    await clientConnection.none('DELETE FROM perfilme.user;')
    request = supertest(app)
  })

  afterAll(async () => {
    await clientConnection.none('DELETE FROM perfilme.user;')
  })

  test('should create a user', async () => {
    const user = {
      name: 'gabriel',
      email: 'gabriel@email.com',
      password: '123456',
      passwordConfirmation: '123456',
    }
    const response = await request
      .post('/user')
      .send(user)
    expect(response.status).toBe(201)
    expect(response.body.id).toBeGreaterThan(0)
    expect(typeof response.body.id).toEqual('number')
    expect(response.body.name).toEqual(user.name)
    expect(response.body.email).toEqual(user.email)
    expect(typeof response.body.password).toEqual('string')
    expect(response.body.password.length).toBeGreaterThan(50)
  })
    
  test('should error if name is small', async () => {
    const user = {
      name: 'g',
      email: 'gabriel@email.com',
      password: '123456',
      passwordConfirmation: '123456',
    }
    const response = await request
      .post('/user')
      .send(user)
    expect(response.status).toBe(400)
    expect(response.body).toEqual(["Nome muito pequeno."])
  })
  
  test('should error if name is great', async () => {
    const bigName = Array(51).fill('a')
    const user = {
      name: bigName,
      email: 'gabriel@email.com',
      password: '123456',
      passwordConfirmation: '123456',
    }
    const response = await request
      .post('/user')
      .send(user)
    expect(response.status).toBe(400)
    expect(response.body).toEqual(["Nome muito grande."])
  })
  
  test('should error if password is great', async () => {
    const bigPassword = Array(51).fill('a')
    const user = {
      name: 'gabriel',
      email: 'gabriel@email.com',
      password: bigPassword,
      passwordConfirmation: bigPassword,
    }
    const response = await request
      .post('/user')
      .send(user)
    expect(response.status).toBe(400)
    expect(response.body).toEqual([
      "Senha muito grande.",
      "Confirmação de senha muito grande.",
    ])
  })
  
  test('should error if password is small', async () => {
    const user = {
      name: 'gabriel',
      email: 'gabriel@email.com',
      password: '12345',
      passwordConfirmation: '12345',
    }
    const response = await request
      .post('/user')
      .send(user)
    expect(response.status).toBe(400)
    expect(response.body).toEqual([
      "Senha muito pequena.",
      "Confirmação de senha muito pequena.",
    ])
  })
  
  test('should error if password confirmation is great', async () => {
    const bigPasswordConfirmation = Array(51).fill('a')
    const user = {
      name: 'gabriel',
      email: 'gabriel@email.com',
      password: bigPasswordConfirmation,
      passwordConfirmation: bigPasswordConfirmation
    }
    const response = await request
      .post('/user')
      .send(user)
    expect(response.status).toBe(400)
    expect(response.body).toEqual([
      "Senha muito grande.",
      "Confirmação de senha muito grande.",
    ])
  })
  
  test('should error if password confirmation is small', async () => {
    const user = {
      name: 'gabriel',
      email: 'gabriel@email.com',
      password: '12345',
      passwordConfirmation: '12345'
    }
    const response = await request
      .post('/user')
      .send(user)
    expect(response.status).toBe(400)
    expect(response.body).toEqual([
      "Senha muito pequena.",
      "Confirmação de senha muito pequena.",
    ])
  })
  
  test('should error if password is different of password confirmation', async () => {
    const user = {
      name: 'gabriel',
      email: 'gabriel@email.com',
      password: '123456',
      passwordConfirmation: '654321'
    }
    const response = await request
      .post('/user')
      .send(user)
    expect(response.status).toBe(400)
    expect(response.body).toEqual(["Senha está diferente da confirmação de senha."])
  })
  
  test('should error if account has exists', async () => {
    const user = {
      name: 'gabriel',
      email: 'gabriel@email.com',
      password: '123456',
      passwordConfirmation: '123456'
    }
    await request.post('/user').send(user)
    const response = await request.post('/user').send(user)
    expect(response.status).toBe(400)
    expect(response.body).toEqual(["Usuário já cadastrado."])
  })
})
