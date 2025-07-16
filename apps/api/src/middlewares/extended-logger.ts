import { createMiddleware } from 'hono/factory'
import { getPath } from 'hono/utils/url'

export const extendedLogger = createMiddleware(async (c, next) => {
  const { method } = c.req
  const path = getPath(c.req.raw)

  let body = null
  if (['POST', 'PUT', 'PATCH'].includes(method)) {
    try {
      // Clone the request to avoid consuming the body
      const clonedRequest = c.req.raw.clone()
      const text = await clonedRequest.text()

      // Try to parse as JSON, fallback to text
      try {
        body = JSON.parse(text)
      } catch {
        body = text
      }
    } catch (e) {
      body = 'Could not read body'
    }
  }

  console.info({
    requestId: c.get('requestId') || undefined,
    request: {
      method,
      path,
      headers: c.req.header(),
      query: c.req.query(),
      body,
    },
  })

  return await next()
})
