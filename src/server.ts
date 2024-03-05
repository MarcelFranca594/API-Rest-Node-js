import fastity from 'fastify'
import { env } from './env'
import { transactionsRoutes } from './routes/transactions'
// Criar a base da aplicação
const app = fastity()
// 5 Principais métodos GET, POST, PUT,  PUTCH, DELETE
// http://localhost:3333/helo

app.register(transactionsRoutes, {
  prefix: 'transactions',
})

app
  .listen({
    port: env.PORT, // Usa a porta definida na variável de ambiente PORT
  })
  .then(() => {
    console.log('HTTP Server Running!')
  })
