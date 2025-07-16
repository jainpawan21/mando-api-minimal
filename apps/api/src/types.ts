import type { OpenAPIHono, RouteConfig, RouteHandler } from '@hono/zod-openapi'

export type AppRouteHandler<R extends RouteConfig> = RouteHandler<R>

export type AppOpenAPI = OpenAPIHono
