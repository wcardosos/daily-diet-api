import fastify from 'fastify'
import { mealsRoutes } from './routes/meals'
import cookie from '@fastify/cookie'
import { usersRoutes } from './routes/users'

const app = fastify()

app.register(cookie)

app.register(usersRoutes)
app.register(mealsRoutes, { prefix: 'meals' })

app.listen({ port: 3333 }).then(() => console.log('Server is running'))
