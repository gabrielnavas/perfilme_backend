const supertest = require('supertest')
const app = require('../../src/app')

const { clientConnection } = require('../../src/infra/db/connection')

describe('Create a User', () => {
  let request

  beforeEach(async () => {
    await clientConnection.none('DELETE FROM perfilme.user;')
    request = supertest(app)
  })

  afterAll(async () => {
    await clientConnection.none('DELETE FROM perfilme.user;')
  })

  test('should return 201 and user created', async () => {
    const user = {
      name: 'gabriel',
      email: 'gabriel@email.com',
      password: '123456',
      passwordConfirmation: '123456',
    }
    const response = await request
      .post('/user')
      .send(user)
    const userCreated = response.body
    expect(response.status).toBe(201)
    expect(userCreated.id).toBeGreaterThan(0)
    expect(typeof userCreated.id).toEqual('number')
    expect(userCreated.name).toEqual(user.name)
    expect(userCreated.email).toEqual(user.email)
  })
})


describe('Check usecase errors, returning status 400 and erros list', () => {
  let request

  beforeEach(async () => {
    await clientConnection.none('DELETE FROM perfilme.user;')
    request = supertest(app)
  })

  afterAll(async () => {
    await clientConnection.none('DELETE FROM perfilme.user;')
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


describe('Check body missing params errors, returning status 400 and erros list', () => {
  let request

  beforeEach(async () => {
    request = supertest(app)
  })

  test('should error if name is small', async () => {
    const user = {
      email: 'gabriel@email.com',
      password: '123456',
      passwordConfirmation: '123456',
    }
    const response = await request
      .post('/user')
      .send(user)
    expect(response.status).toBe(400)
    expect(response.body).toEqual(["missing param: name"])
  })
  
  test('should error if name is great', async () => {
    const user = {
      name: 'any_name',
      password: '123456',
      passwordConfirmation: '123456',
    }
    const response = await request
      .post('/user')
      .send(user)
    expect(response.status).toBe(400)
    expect(response.body).toEqual(["missing param: email"])
  })

  test('should error if name is great', async () => {
    const user = {
      name: 'any_name',
      email: 'any_email@email.com',
      passwordConfirmation: '123456',
    }
    const response = await request
      .post('/user')
      .send(user)
    expect(response.status).toBe(400)
    expect(response.body).toEqual(["missing param: password"])
  })

  test('should error if name is great', async () => {
    const user = {
      name: 'any_name',
      email: 'any_email@email.com',
      password: '123456',
    }
    const response = await request
      .post('/user')
      .send(user)
    expect(response.status).toBe(400)
    expect(response.body).toEqual(["missing param: passwordConfirmation"])
  })
  
})

