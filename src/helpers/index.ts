import crypto from 'crypto'

const SECERT = process.env.SECERT || "secp256k1"

export const random = () => crypto.randomBytes(128).toString('base64')

export const authentication = (salt: string, password: string) => {
   return crypto.createHmac('sha256', [salt, password].join("/")).update(SECERT).digest('hex')
}
