import { FastifyInstance } from 'fastify'
import { knex } from '../database'

export async function transactionsRoutes(app: FastifyInstance) {
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
}
