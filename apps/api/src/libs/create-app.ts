import { OpenAPIHono } from '@hono/zod-openapi'
import { contextStorage } from 'hono/context-storage'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'
import { prettyJSON } from 'hono/pretty-json'
import { requestId } from 'hono/request-id'
import { secureHeaders } from 'hono/secure-headers'
import { timing } from 'hono/timing'
import { trimTrailingSlash } from 'hono/trailing-slash'
import { validateCorsOrigin } from '../helpers/cors-origin'
import { handleError, handleNotFound, handleZodError } from '../helpers/errors'
import { extendedLogger } from '../middlewares/extended-logger'
import type { AppOpenAPI } from '../types'

export const batchFetch = () => {
  const originalFetch = globalThis.fetch

  globalThis.fetch = async (url, options = {}) => {
    const requestId = crypto.randomUUID()

    console.log('[FETCH OUT]', {
      requestId,
      url: url.toString(),
      method: options.method || 'GET',
      headers: options.headers,
      body: options.body
        ? typeof options.body === 'string'
          ? options.body.substring(0, 200)
          : '[Body Object]'
        : null,
      timestamp: new Date().toISOString(),
    })

    try {
      const response = await originalFetch(url, options)

      console.log('[FETCH RESPONSE]', {
        requestId,
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers.entries()),
        ok: response.ok,
      })

      return response
    } catch (error) {
      console.error('[FETCH ERROR]', {
        requestId,
        error: error.message,
        stack: error.stack,
      })
      throw error
    }
  }
}

export function createRouter() {
  return new OpenAPIHono({
    strict: false,
    defaultHook: handleZodError,
  })
}

export function createApp() {
  const app = createRouter().basePath('/api')

  app.notFound(handleNotFound)
  app.onError(handleError)

  // * Middlewares
  app.use(
    cors({
      credentials: true,
      origin: validateCorsOrigin,
      allowHeaders: [
        'Content-Type',
        'Authorization',
        'Cookie',
        'X-CSRF-Token',
        'user-agent',
        'origin',
        'host',
      ],
    })
  )
  app.use(logger())
  app.use(contextStorage())
  app.use(prettyJSON())
  app.use(requestId())

  app.use(extendedLogger)
  app.use(
    secureHeaders({
      crossOriginResourcePolicy: 'cross-origin',
    })
  )
  app.use(timing())
  app.use(trimTrailingSlash())


  return app
}

export function createTestApp<R extends AppOpenAPI>(router: R) {
  return createApp().route('/', router)
}
