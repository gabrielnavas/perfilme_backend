const route = require('express').Router()

const userUsecase = require('../usecases/userUsecase')

route.post('/user', async (req,res) => {

  for (const param of ['name', 'password', 'email']) {
    if(!req.body[param]) {
      return res.status(400).json([`missing param: ${param}`])
    }
  }

  const {errors, userCreated} = await userUsecase.create({
    name: req.body.name, 
    email: req.body.email, 
    password: req.body.password
  })
  if(errors.length > 0) {
    return res.status(400).json(error)
  }

  res.status(200).json(userCreated)
})

module.exports = route