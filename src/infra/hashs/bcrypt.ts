import bcrypt from 'bcrypt'

export const hash = (plainText: string): Promise<string> => {
  const salt = 10
  return bcrypt.hash(plainText, salt)
}

export const compare = 
  (plainText: string, encryptedText: string): Promise<boolean> => {
    return bcrypt.compare(plainText, encryptedText)
  }