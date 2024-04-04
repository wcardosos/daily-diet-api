// eslint-disable-next-line @typescript-eslint/no-unused-vars
import fastify from 'fastify'

declare module 'fastify' {
  interface FastifyRequest {
    user: {
      id: string
      fullName: string
      email: string
      sessionId: string
    } | null
  }
}
