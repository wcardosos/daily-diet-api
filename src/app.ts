import fastify from 'fastify'
import { mealsRoutes } from './routes/meals'
import cookie from '@fastify/cookie'
import { usersRoutes } from './routes/users'

export const app = fastify()

app.register(cookie)

app.register(usersRoutes)
app.register(mealsRoutes, { prefix: 'meals' })
