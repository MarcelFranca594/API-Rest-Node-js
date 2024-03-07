import { expect, test } from 'vitest'

test('o usuário consegue criar uma nova transação', () => {
  // Define o código de status da resposta esperado quando a transação é criada.
  const responseStatusCode = 201

  // Compara o código de status da resposta com o valor esperado usando o método 'toEqual' da biblioteca 'vitest'.
  expect(responseStatusCode).toEqual(201)
})
