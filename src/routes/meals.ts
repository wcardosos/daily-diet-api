/* eslint-disable @typescript-eslint/no-explicit-any */
import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { sessionHandler } from '../middlewares/session-handler'
import { MealsRepository } from '../repositories/meals'
import { FetchAllMealsService } from '../services/meals/fetch-all'
import { FetchMealByIdService } from '../services/meals/fetch-by-id'
import { CreateMealService } from '../services/meals/create'
import { UpdateMealService } from '../services/meals/update'
import { DeleteMealService } from '../services/meals/delete'

const mealsRepository = new MealsRepository()

// This is a Fastify plugin. A plugin is a way to separate application logics in files.
export async function mealsRoutes(app: FastifyInstance) {
  app.get('/', { preHandler: [sessionHandler] }, async (req, reply) => {
    const { meals } = await new FetchAllMealsService(mealsRepository).execute({
      userId: req.user!.id,
    })

    return reply.send(meals.map((meal) => meal.toJson()))
  })

  app.post('/', { preHandler: [sessionHandler] }, async (req, reply) => {
    const createMealBodySchema = z.object({
      name: z.string(),
      description: z.string(),
      partOfDiet: z.boolean(),
      time: z.string(),
    })
    const { name, description, partOfDiet, time } = createMealBodySchema.parse(
      req.body,
    )

    await new CreateMealService(mealsRepository).execute({
      name,
      description,
      partOfDiet,
      time,
      userId: req.user!.id,
    })

    return reply.status(201).send()
  })

  app.get('/:id', { preHandler: [sessionHandler] }, async (req, reply) => {
    const updateMealParamsSchema = z.object({
      id: z.string().uuid(),
    })

    const { id } = updateMealParamsSchema.parse(req.params)

    try {
      const fetchMealByIdService = new FetchMealByIdService(mealsRepository)

      const { meal } = await fetchMealByIdService.execute({
        id,
        userId: req.user!.id,
      })

      return reply.send(meal.toJson())
    } catch (error: any) {
      return reply.status(error.statusCode).send()
    }
  })

  app.put('/:id', { preHandler: [sessionHandler] }, async (req, reply) => {
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

    await new UpdateMealService(mealsRepository).execute({
      id,
      name,
      description,
      partOfDiet,
      time,
      userId: req.user!.id,
    })

    return reply.status(200).send()
  })

  app.delete('/:id', { preHandler: [sessionHandler] }, async (req, reply) => {
    const updateMealParamsSchema = z.object({
      id: z.string().uuid(),
    })

    const { id } = updateMealParamsSchema.parse(req.params)

    await new DeleteMealService(mealsRepository).execute({
      id,
      userId: req.user!.id,
    })

    return reply.status(200).send()
  })
}
