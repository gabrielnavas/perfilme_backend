const supertest = require('supertest')
const app = require('../../src/app')
const { clientConnection } = require('../../src/infra/db/connection')
const userRepository = require('../../src/infra/db/userRepository')


const deleteAuthsAndUsers = async clientConnection => {
  await Promise.all([
    clientConnection.none('DELETE FROM perfilme.authentication_token;'),
    clientConnection.none('DELETE FROM perfilme.user;')
  ])
}

describe('Check usecase errors, returning status 400 and erros list', () => {
  let request
  
  beforeAll(async () => {
    await deleteAuthsAndUsers(clientConnection)
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

describe('Create a token with email and password', () => {
  let request
  let userCreated
  let firstToken

  beforeAll(async () => {
    request = supertest(app)
    await deleteAuthsAndUsers(clientConnection)
    userCreated = await userRepository.insert({
      email: 'any_email@email.com',
      password: '123456',
      name: 'any_name'
    })
  })

  afterAll(async () => {
    await deleteAuthsAndUsers(clientConnection)
  })

  test('should return status 201 and a token', async () => {
    const params = {
      email: userCreated.email,
      password: userCreated.password
    }
    const response = await request.post('/auth').send(params)
    firstToken = response.body.token
    expect(typeof response.body.token).toEqual('string')
    expect(response.body.token.length).toBeGreaterThan(0)
  })

  //esta criando tokens duplicados, é preciso invalidaar talvez?
  test('should invalidate the last token on login', async () => {
    const params = {
      email: userCreated.email,
      password: userCreated.password
    }
    await request.post('/auth').send(params)
    const resultValidTokensFromUser = await clientConnection.many(`
      SELECT 
        token, created_at, invalidated_at 
      FROM 
        perfilme.authentication_token
      WHERE 
        id_user = $1 and
        token = $2;
    `, [userCreated.id, firstToken])
    expect(resultValidTokensFromUser[1]).toEqual('')
    expect(resultValidTokensFromUser.length).toEqual(1)
    // expect(new Date(resultValidTokensFromUser[0].created_at).getTime()).toBeGreaterThan(0)
    // expect(new Date(resultValidTokensFromUser[0].invalidated_at).getTime()).toBeGreaterThan(0)
  })
})

describe('Check body missing params errors, returning status 400 and erros list', () => {
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
