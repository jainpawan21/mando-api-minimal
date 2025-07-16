import { handle } from '@hono/node-server/vercel'

// Import the bundled app from dist
// @ts-expect-error
import app from '../dist/index.js'

export default handle(app)
