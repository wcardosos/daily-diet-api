import { FastifyInstance } from 'fastify'
import { knex } from '../database'
import { z } from 'zod'
import { randomUUID } from 'node:crypto'

// This is a Fastify plugin. A plugin is a way to separate application logics in files.
export async function mealsRoutes(app: FastifyInstance) {
  app.get('/', async (req, reply) => {
    const meals = await knex('meals').select('*')

    return reply.send(meals)
  })

  app.post('/', async (req, reply) => {
    const createMealBodySchema = z.object({
      name: z.string(),
      description: z.string(),
      partOfDiet: z.boolean(),
      time: z.string(),
    })
    const { name, description, partOfDiet, time } = createMealBodySchema.parse(
      req.body,
    )

    await knex('meals').insert({
      id: randomUUID(),
      name,
      description,
      part_of_diet: partOfDiet,
      time: new Date(time).toISOString(),
    })

    return reply.status(201).send()
  })

  app.get('/:id', async (req, reply) => {
    const updateMealParamsSchema = z.object({
      id: z.string().uuid(),
    })

    const { id } = updateMealParamsSchema.parse(req.params)

    const [meal] = await knex('meals').select('*').where('id', id)

    if (!meal) return reply.status(404).send()

    return reply.status(200).send(meal)
  })

  app.put('/:id', async (req, reply) => {
    const updateMealBodySchema = z.object({
      name: z.string(),
      description: z.string(),
      partOfDiet: z.boolean(),
      time: z.string(),
    })
    const updateMealParamsSchema = z.object({
      id: z.string().uuid(),
    })
    const { name, description, partOfDiet, time } = updateMealBodySchema.parse(
      req.body,
    )
    const { id } = updateMealParamsSchema.parse(req.params)

    await knex('meals')
      .update({
        name,
        description,
        part_of_diet: partOfDiet,
        time: new Date(time).toISOString(),
        updated_at: new Date().toISOString(),
      })
      .where('id', id)

    return reply.status(200).send()
  })

  app.delete('/:id', async (req, reply) => {
    const updateMealParamsSchema = z.object({
      id: z.string().uuid(),
    })

    const { id } = updateMealParamsSchema.parse(req.params)

    await knex('meals').delete().where('id', id)

    return reply.status(200).send()
  })
}
