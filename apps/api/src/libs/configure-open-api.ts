import { Scalar } from '@scalar/hono-api-reference'

import type { AppOpenAPI } from '../types'
import { getOriginUrl } from '../utils/get-origin-url'

export function configureOpenAPI(app: AppOpenAPI) {
  // * OpenAPI json endpoint
  app.doc31('/openapi.json', c => ({
    openapi: '3.1.0',
    info: {
      version: '1.0.0',
      title: 'Mando.cx API Reference',
    },

    servers: [
      {
        url: getOriginUrl(c),
        description: 'Current environment',
      },
    ],
    webhooks: {
      '/burgers': {
        post: {},
      },
    },
  }))

  // API Reference documentation
  app.get(
    '/swagger',
    Scalar({
      pageTitle: 'Mando.cx API Reference',
      theme: 'deepSpace',
      url: '/api/openapi.json',
    })
  )
  app.openAPIRegistry.registerComponent('securitySchemes', 'Bearer', {
    type: 'http',
    scheme: 'bearer',
  })
}
