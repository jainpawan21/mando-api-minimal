import { defineWorkspace } from 'vitest/config'

export default defineWorkspace([
  './apps/storybook/vite.config.ts',
  './apps/web/vite.config.ts',
  './libs/design-system/vite.config.ts',
])
