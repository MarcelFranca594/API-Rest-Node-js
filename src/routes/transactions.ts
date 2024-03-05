import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { randomUUID } from 'node:crypto'
import { knex } from '../database'

export async function transactionsRoutes(app: FastifyInstance) {
  // Criando uma rota POST em '/' na instância do Fastify
  app.post('/', async (request, reply) => {
    // { title, amount, type: credit ou debit}
    // Criando uma nova transção

    // Definindo o esquema para o corpo da requisição
    const createTransactionBodySchema = z.object({
      title: z.string(), // O título da transação é uma string
      amount: z.number(),
      type: z.enum(['credit', 'debit']),
    })

    // Extrai o título, o valor e o tipo da transação do corpo da requisição, validando com o esquema definido
    const { title, amount, type } = createTransactionBodySchema.parse(
      request.body,
    )

    // Criando uma nova transaçã
    await knex('transactions').insert({
      id: crypto.randomUUID(),
      title,
      amount: type === 'credit' ? amount : amount * -1,
    })

    return reply.status(201).send()
  })
}
