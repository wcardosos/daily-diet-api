import { FastifyReply, FastifyRequest } from 'fastify'
import { knex } from '../database'

export async function sessionHandler(req: FastifyRequest, reply: FastifyReply) {
  const { sessionId } = req.cookies

  if (!sessionId) {
    req.user = null

    return reply.status(401).send()
  }

  if (!req.user) {
    const [user] = await knex('users')
      .select('id', 'full_name', 'email', 'session_id')
      .where('session_id', sessionId)

    req.user = {
      id: user.id,
      email: user.email,
      fullName: user.full_name,
      sessionId: user.session_id,
    }
  }
}
