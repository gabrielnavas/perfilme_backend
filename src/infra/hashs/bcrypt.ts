import bcrypt from 'bcrypt'

export const hash = (plainText: string): Promise<string> => {
  const salt = 10
  return bcrypt.hash(plainText, salt)
}
