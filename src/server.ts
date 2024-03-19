import { app } from './app'
import { env } from './env'

app
  .listen({
    port: env.PORT, // Usa a porta definida na variável de ambiente PORT
  })
  .then(() => {
    console.log('HTTP Server Running!')
  })
