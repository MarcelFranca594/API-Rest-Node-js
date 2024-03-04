import fastity from 'fastify'
import { knex } from './database'
// Criar a base da aplicação
const app = fastity()
// 5 Principais métodos GET, POST, PUT,  PUTCH, DELETE
// http://localhost:3333/helo
app.get('/hello', async () => {
  const tables = await knex('sqlite_schema').select('*')

  return tables
})
app
  .listen({
    port: 3333,
  })
  .then(() => {
    console.log('HTTP Server Running!')
  })
