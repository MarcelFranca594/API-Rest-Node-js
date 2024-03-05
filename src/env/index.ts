import { error } from 'console'
import 'dotenv/config'
import { z } from 'zod'

// Schema = Formato de dados => Formato de dados que irá receber das Variaveis Ambiente
// Define um esquema para as variáveis de ambiente usando a biblioteca zod
const envSchema = z.object({
  // Define a variável NODE_ENV que só pode ter os valores 'development', 'test' ou 'production', com 'production' como valor padrão
  NODE_ENV: z.enum(['development', 'test', 'production']).default('production'),
  // Define a variável DATABASE_URL como uma string obrigatória
  DATABASE_URL: z.string(),
  // Define a variável PORT como um número, com o valor padrão 3333
  PORT: z.number().default(3333),
})

const _env = envSchema.safeParse(process.env)

// Verifica se o parse foi bem-sucedido
if (_env === false) {
  // Se não, exibe uma mensagem de erro no console com detalhes do erro
  console.error('Invalid environment variables!', _env.error.format())
  // E lança um erro indicando que as variáveis de ambiente são inválidas
  throw new error('Invalid environment variables.')
}

// Se o parse foi bem-sucedido, exporta os dados das variáveis de ambiente
export const env = _env.data
