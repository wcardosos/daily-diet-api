import { FastifyInstance } from 'fastify'
import request from 'supertest'

export async function createUserRequest(
  app: FastifyInstance,
): Promise<string[]> {
  const response = await request(app.server).post('/register').send({
    fullName: 'Test',
    email: 'test@test.com',
    password: 'test1234',
  })

  const cookies = response.get('Set-Cookie')

  if (!cookies) throw new Error('Bad login credentials')

  return cookies
}
