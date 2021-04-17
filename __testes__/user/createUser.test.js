const supertest = require('supertest')
const app = require('../../src/app')

test('should create a user', async () => {
  const user = {
    name: 'gabriel',
    email: 'gabriel@email.com',
    password: '123456'
  }
  const response = await supertest(app)
    .post('/user')
    .send(user)
  expect(response.status).toBe(200)
  expect(response.body.id).toBeGreaterThan(0)
  expect(typeof response.body.id).toEqual('number')
  expect(response.body.name).toEqual(user.name)
  expect(response.body.email).toEqual(user.email)
  expect(response.body.password).toEqual(user.password)
})
  
