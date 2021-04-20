const route = require('express').Router()

const authenticationUseCase = require('../../usecases/authenticationUseCase')

route.post('/auth', async (req,res) => {
  try {
    for (const param of ['email', 'password',]) {
      if(req.body[param] === undefined) {
        return res.status(400).json([`missing param: ${param}`])
      }
    }
    const {errors, auth} = await authenticationUseCase.createToken({
      email: String(req.body.email), 
      password: String(req.body.password),
    })
    if(errors.length > 0) {
      return res.status(400).json(errors)
    }
    res.status(201).json(auth)
  }
  catch(error) {
    res.status(500).json(['server error'])
  }
})

module.exports = route