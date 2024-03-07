import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { randomUUID } from 'node:crypto'
import { knex } from '../database'
import { checkSessionIdExists } from '../middlewares/check-session-id-exists'

export async function transactionsRoutes(app: FastifyInstance) {
  /*
  app.addHook('preHandler', async (request, reply) => {
    console.log(`[${request.method}] ${request.url}`)
  })
  */
  // Criando uma rota de listagem
  app.get(
    '/',
    {
      preHandler: [checkSessionIdExists],
    },
    async (request, reply) => {
      const { sessionId } = request.cookies
      // Buscando todas as transações do banco de dados usando o knex e armazenando na variável transactions
      const transactions = await knex('transactions')
        .where('session_id', sessionId)
        .select()

      // Retornando um objeto contendo as transações
      return {
        transactions,
      }
    },
  )

  // Criando uma rota que mostra detalhes de uma transação com base em seu ID
  // Exemplo de chamada: http://localhost:3333/transactions/skjdbks-154d5s-sds-12254
  app.get(
    '/:id',
    {
      preHandler: [checkSessionIdExists],
    },
    async (request) => {
      // Definindo um esquema para validar os parâmetros da requisição, garantindo que o ID seja uma string UUID válida
      const getTransactionParamsSchema = z.object({
        id: z.string().uuid(),
      })

      // Validando os parâmetros da requisição com base no esquema definido e extraindo o ID da requisição
      const { id } = getTransactionParamsSchema.parse(request.params)

      const { sessionId } = request.cookies

      // Buscando a transação no banco de dados com base no ID fornecido e armazenando na variável transaction
      const transaction = await knex('transactions')
        .where({
          session_id: sessionId,
          id,
        })
        .first()

      // Retornando um objeto contendo os detalhes da transação encontrada
      return { transaction }
    },
  )

  // Criando uma rota para resumir as transações
  app.get(
    '/summary',
    {
      preHandler: [checkSessionIdExists],
    },
    async (request) => {
      const { sessionId } = request.cookies

      // Buscando o resumo das transações do banco de dados usando o knex, que calcula a soma dos valores da coluna 'amount'
      // e armazena como 'amount' e retorna apenas o primeiro resultado
      const summary = await knex('transactions')
        .where('session_id', sessionId)
        .sum('amount', { as: 'amount' })
        .first()

      return { summary }
    },
  )

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

    // Obtendo o valor do cookie 'sessionId' da requisição HTTP
    let sessionId = request.cookies.sessionId

    // Verificando se o cookie 'sessionId' não existe
    if (!sessionId) {
      // Gerando um novo ID de sessão aleatório usando a função randomUUID()
      sessionId = randomUUID()

      // Definindo um novo cookie 'sessionId' na resposta HTTP com o valor gerado anteriormente
      reply.cookie('sessionId', sessionId, {
        path: '/',
        maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days => Definindo o tempo máximo de vida do cookie em milissegundos (7 dias)
      })
    }

    // Criando uma nova transação
    await knex('transactions').insert({
      id: randomUUID(),
      title,
      amount: type === 'credit' ? amount : amount * -1,
      session_id: sessionId,
    })

    return reply.status(201).send()
  })
}
