import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { randomUUID } from 'node:crypto'
import { knex } from '../database'

export async function transactionsRoutes(app: FastifyInstance) {
  // Criando uma rota de listagem
  app.get('/', async () => {
    // Buscando todas as transações do banco de dados usando o knex e armazenando na variável transactions
    const transactions = await knex('transactions').select()

    // Retornando um objeto contendo as transações
    return {
      transactions,
    }
  })

  // Criando uma rota que mostra detalhes de uma transação com base em seu ID
  // Exemplo de chamada: http://localhost:3333/transactions/skjdbks-154d5s-sds-12254
  app.get('/:id', async (request) => {
    // Definindo um esquema para validar os parâmetros da requisição, garantindo que o ID seja uma string UUID válida
    const getTransactionParamsSchema = z.object({
      id: z.string().uuid(),
    })

    // Validando os parâmetros da requisição com base no esquema definido e extraindo o ID da requisição
    const { id } = getTransactionParamsSchema.parse(request.params)

    // Buscando a transação no banco de dados com base no ID fornecido e armazenando na variável transaction
    const transaction = await knex('transactions').where('id', id).first()

    // Retornando um objeto contendo os detalhes da transação encontrada
    return { transaction }
  })

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

    // Criando uma nova transação
    await knex('transactions').insert({
      id: randomUUID(),
      title,
      amount: type === 'credit' ? amount : amount * -1,
    })

    return reply.status(201).send()
  })
}
