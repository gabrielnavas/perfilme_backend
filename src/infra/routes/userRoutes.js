const route = require('express').Router()

const userUsecase = require('../../usecases/userUsecase')

route.post('/user', async (req,res) => {
  const bodyMissingParamsErrors = []
  for (const param of ['name', 'email', 'password', 'passwordConfirmation']) {
    if(req.body[param] === undefined) {
      bodyMissingParamsErrors.push(`missing param: ${param}`)
    }
  }
  if(bodyMissingParamsErrors.length > 0) {
    return res.status(400).json(bodyMissingParamsErrors)
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
  const { password, ...userLessPassword } = userCreated
  res.status(201).json(userLessPassword)
})

module.exports = route