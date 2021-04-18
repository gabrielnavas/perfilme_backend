const route = require('express').Router()

const userUsecase = require('../../usecases/userUsecase')

route.post('/user', async (req,res) => {

  for (const param of ['name', 'email', 'password', 'passwordConfirmation']) {
    if(req.body[param] === undefined) {
      return res.status(400).json([`missing param: ${param}`])
    }
  }

  const {errors, userCreated} = await userUsecase.create({
    name: String(req.body.name), 
    email: String(req.body.email), 
    password: String(req.body.password),
    passwordConfirmation: String(req.body.passwordConfirmation)
  })
  if(errors.length > 0) {
    return res.status(400).json(errors)
  }

  res.status(201).json(userCreated)
})

module.exports = route