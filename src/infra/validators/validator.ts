import validator from 'validator'

export const isEmail = (email: string) => 
  validator.isEmail(email)
