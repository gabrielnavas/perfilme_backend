import { Request, Response, Router } from 'express'
const route = Router()

import { createTokenUseCase } from '../../usecases/createTokenUseCase' 

route.post('/auth', async (req: Request, res: Response) => {
  try {
    for (const param of ['email', 'password',]) {
      if(req.body[param] === undefined) {
        return res.status(400).json([`missing param: ${param}`])
      }
    }
    const resultTokenUseCase = await createTokenUseCase({
      email: String(req.body.email), 
      password: String(req.body.password),
    })
    if(resultTokenUseCase.hasError) {
      return res.status(400).json(resultTokenUseCase.errors)
    }
    res.status(201).json({ 
        token: resultTokenUseCase.token,
        user: { name: resultTokenUseCase.user?.name } 
    })
  }
  catch(error) {
    console.log(error)
    res.status(500).json(['server error'])
  }
})

module.exports = route