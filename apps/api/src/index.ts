import { configureOpenAPI } from './libs/configure-open-api'
import { batchFetch, createApp } from './libs/create-app'
import { getNovu } from '@mando/services/libs/novu'

batchFetch()

const app = createApp()

configureOpenAPI(app)

app.get('/', c => {
  return c.json({ message: 'Hello Mando!' })
})
app.get('/ping', c => {
  return c.text('pong')
})

app.get('/novu-test', async c => {
  try {
    const now = new Date().toISOString()
  const novuResponse = await getNovu().trigger({
    workflowId: 'test-workflow-1234',
    to: {
      subscriberId: 'omar-12345',
      email: 'omar@mando.cx',
      firstName: 'Omar',
    },
    payload: {
      now,
    },
  })
    console.log({novuResponse});
    
    return c.json({ novuResponse })
  } catch (error) {
    console.log({error});
    
    return c.json({ error: error }, 500)
  }
})  


export default app
