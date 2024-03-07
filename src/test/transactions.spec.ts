import { expect, it, beforeAll, afterAll, describe, expect } from 'vitest'
import request from 'supertest'
import { app } from '../app'

describe('Transactions routes', () => {
  /*
Executar um código antes que todos testes executem
Executa uma apenas única vez antes de todos os testes
Essa função é executada antes de todos os testes dentro de um bloco
de testes específico.
*/
  beforeAll(async () => {
    await app.ready()
  })

  /*
Ele serve para executar um bloco de código após a conclusão de todos os testes 
em um conjunto de testes. Essa função é útil para realizar tarefas de limpeza 
ou finalização após a execução de todos os testes, como fechar conexões com 
bancos de dados, liberar recursos, limpar o ambiente de teste, entre outras 
ações.
*/
  afterAll(async () => {
    await app.close()
  })

  it('should be able to create a new transaction', async () => {
    await request(app.server)
      .post('/transactions')
      .send({
        title: 'New transaction',
        amount: 5000,
        type: 'credit',
      })
      .expect(201)
  })
  it('should be able to list all transactions', async () => {
    const createTransactionResponse = await request(app.server)
      .post('/transactions')
      .send({
        title: 'New transaction',
        amount: 5000,
        type: 'credit',
      })

    const cookies = createTransactionResponse.get('Set-Cookie')

    const listTransactionsResponse = await request(app.server)
      .get('/transactions')
      .set('Cookie', cookies)
      .expect(200)

    expect(listTransactionsResponse.body.transactions).toEqual([
      expect.objectContaining({
        title: 'New transaction',
        amount: 5000,
      }),
    ])
  })
})
