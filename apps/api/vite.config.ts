import build from '@hono/vite-build/vercel'
import devServer from '@hono/vite-dev-server'
import nodeAdapter from '@hono/vite-dev-server/node'
import { defineConfig, loadEnv } from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  const envs = { ...process.env, ...env }

  return {
    define: {
      'process.env': JSON.stringify(envs),
    },
    resolve: {
      alias: {
        // Force svix-fetch to use the Node.js version
        'svix-fetch': 'svix-fetch/fetch-npm-node.js',
      },
      conditions: ['node'],
    },
    server: {
      port: 4000,
    },
    plugins: [
      devServer({
        entry: './src/index.ts',
        adapter: nodeAdapter(),
      }),
      tsconfigPaths(),
      build({
        entry: './src/index.ts',
      }),
    ],
  }
})
