import type { Context } from 'hono'

export const getOriginUrl = (c: Context) => {
  const url = c.req.header('origin') ?? c.req.header('referer') ?? c.req.url

  const origin = new URL(url).origin

  return origin
}
