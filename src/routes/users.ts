/* eslint-disable @typescript-eslint/no-explicit-any */
import { FastifyInstance } from 'fastify'
import { ZodError, z } from 'zod'
import { RegisterUserService } from '../services/users/register'
import { UsersRepository } from '../repositories/users'
import { LoginUserService } from '../services/users/login'

/*
  Cookies

  São formas de se manter contexto entre requisições.
*/

const usersRepository = new UsersRepository()

export async function usersRoutes(app: FastifyInstance) {
  app.post('/register', async (req, reply) => {
    const registerUserBodySchema = z.object({
      fullName: z.string(),
      email: z.string().email(),
      password: z.string(),
    })

    try {
      const { email, fullName, password } = registerUserBodySchema.parse(
        req.body,
      )

      const { sessionId } = await new RegisterUserService(
        usersRepository,
      ).execute({
        fullName,
        email,
        password,
      })

      reply.cookie('sessionId', sessionId, {
        path: '/',
        maxAge: 60 * 60 * 6, // 6 hours
      })

      return reply.status(201).send()
    } catch (error: any) {
      if (error instanceof ZodError) {
        return reply.status(400).send({ message: error.format() })
      }

      return reply.status(500).send(error.message)
    }
  })

  app.post('/login', async (req, reply) => {
    const loginUserBodySchema = z.object({
      email: z.string().email(),
      password: z.string(),
    })

    const { email, password } = loginUserBodySchema.parse(req.body)

    try {
      const { sessionId } = await new LoginUserService(usersRepository).execute(
        {
          email,
          password,
        },
      )

      reply.cookie('sessionId', sessionId, {
        path: '/',
        maxAge: 60 * 60 * 6, // 6 hours
      })

      return reply.send()
    } catch (error: any) {
      return reply.status(401).send(error.message)
    }
  })
}
