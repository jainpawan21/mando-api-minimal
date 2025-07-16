import { Novu } from '@novu/api'

const novuSecretKey = process.env.NOVU_SECRET_KEY

if (!novuSecretKey) {
  throw new Error('NOVU_SECRET_KEY is not set')
}

export const novu = new Novu({
  secretKey: novuSecretKey,
  serverURL: 'https://eu.api.novu.co',
})


export const getNovu = () => {
  const novuSecretKey = process.env.NOVU_SECRET_KEY
  if (!novuSecretKey) {
    throw new Error('NOVU_SECRET_KEY is not set')
  }

  return new Novu({
    secretKey: novuSecretKey,
    serverURL: 'https://eu.api.novu.co',
  })
}