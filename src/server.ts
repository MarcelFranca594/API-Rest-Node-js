import fastity from 'fastify'
import { knex } from './database'
// Criar a base da aplicação
const app = fastity()
// 5 Principais métodos GET, POST, PUT,  PUTCH, DELETE
// http://localhost:3333/helo
app.get('/hello', async () => {
  // Realizando queries com Knex
  const transactions = await knex('transactions')
    .where('amount', 1000)
    .select('*')

  /*
    .insert({
      id: crypto.randomUUID(),
      title: 'Transação de teste',
      amount: 1000,
    })
    .returning('*')
  */
  return transactions
})
app
  .listen({
    port: 3333,
  })
  .then(() => {
    console.log('HTTP Server Running!')
  })
