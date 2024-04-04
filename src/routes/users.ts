import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { knex } from '../database'
import { randomUUID } from 'node:crypto'
import bcrypt from 'bcrypt'

/*
  Cookies

  São formas de se manter contexto entre requisições.
*/

export async function usersRoutes(app: FastifyInstance) {
  app.post('/register', async (req, reply) => {
    const registerUserBodySchema = z.object({
      fullName: z.string(),
      email: z.string().email(),
      password: z.string(),
    })

    const { email, fullName, password } = registerUserBodySchema.parse(req.body)

    const sessionId = randomUUID()

    await knex('users').insert({
      id: randomUUID(),
      full_name: fullName,
      email,
      password: await bcrypt.hash(password, 10),
      session_id: sessionId,
    })

    reply.cookie('sessionId', sessionId, {
      path: '/',
      maxAge: 60 * 60 * 6, // 6 hours
    })

    return reply.status(201).send()
  })

  app.post('/login', async (req, reply) => {
    const loginUserBodySchema = z.object({
      email: z.string().email(),
      password: z.string(),
    })

    const { email, password } = loginUserBodySchema.parse(req.body)

    const [user] = await knex('users')
      .select('email', 'password', 'session_id')
      .where('email', email)

    if (!user) return reply.status(404).send()

    const isCorrectPassword = await bcrypt.compare(password, user.password)

    if (!isCorrectPassword) return reply.status(401).send()

    reply.cookie('sessionId', user.session_id, {
      path: '/',
      maxAge: 60 * 60 * 6, // 6 hours
    })

    return reply.send()
  })
}
