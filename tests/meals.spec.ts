import { describe, afterAll, beforeAll, it, beforeEach, expect } from 'vitest'
import request from 'supertest'
import { execSync } from 'node:child_process'
import { app } from '../src/app'
import { createUserRequest } from './utils'
import { FastifyInstance } from 'fastify'
import { knex } from '../src/database'

async function createMeal(app: FastifyInstance, cookies: string[]) {
  await request(app.server)
    .post('/meals')
    .send({
      name: 'Breakfast',
      description: 'Bacon and eggs',
      partOfDiet: false,
      time: '2024-04-07 18:33:00',
    })
    .set('Cookie', cookies)
}

describe('Meals routes', () => {
  beforeAll(async () => {
    await app.ready()
  })

  beforeEach(() => {
    execSync('npm run knex migrate:rollback --all')
    execSync('npm run knex migrate:latest')
  })

  afterAll(async () => {
    await app.close()
  })

  describe('[POST] /meals', () => {
    it('should create a meal', async () => {
      const cookies = await createUserRequest(app)

      await request(app.server)
        .post('/meals')
        .send({
          name: 'Breakfast',
          description: 'Bacon and eggs',
          partOfDiet: false,
          time: '2024-04-07 18:33:00',
        })
        .set('Cookie', cookies)
        .expect(201)
    })
  })

  describe('[GET] /meals', () => {
    it('should list all meals', async () => {
      const cookies = await createUserRequest(app)
      await createMeal(app, cookies)

      const response = await request(app.server)
        .get('/meals')
        .set('Cookie', cookies)
        .expect(200)

      expect(response.body).toEqual([
        expect.objectContaining({
          name: 'Breakfast',
          description: 'Bacon and eggs',
          part_of_diet: false,
          time: expect.any(String),
        }),
      ])
    })
  })

  describe('[GET] /meals/:id', () => {
    it('should list a meal', async () => {
      const cookies = await createUserRequest(app)
      await createMeal(app, cookies)

      const [meal] = await knex('meals').select('id').limit(1)

      const response = await request(app.server)
        .get(`/meals/${meal.id}`)
        .set('Cookie', cookies)
        .expect(200)

      expect(response.body).toEqual(
        expect.objectContaining({
          name: 'Breakfast',
          description: 'Bacon and eggs',
          part_of_diet: false,
          time: expect.any(String),
        }),
      )
    })
  })

  describe('[PUT] /meals/:id', () => {
    it('should update a meal', async () => {
      const cookies = await createUserRequest(app)
      await createMeal(app, cookies)

      const [meal] = await knex('meals').select('id').limit(1)

      await request(app.server)
        .put(`/meals/${meal.id}`)
        .send({
          name: 'Breakfast',
          description: 'Watermelon',
          partOfDiet: true,
          time: '2024-04-07 18:55:00',
        })
        .set('Cookie', cookies)
        .expect(200)

      const updatedMealResponse = await request(app.server)
        .get(`/meals/${meal.id}`)
        .set('Cookie', cookies)

      expect(updatedMealResponse.body).toEqual(
        expect.objectContaining({
          name: 'Breakfast',
          description: 'Watermelon',
          part_of_diet: true,
        }),
      )
    })

    describe('[DELETE] /meals/:id', () => {
      it('should delete a meal', async () => {
        const cookies = await createUserRequest(app)
        await createMeal(app, cookies)

        const [meal] = await knex('meals').select('id').limit(1)

        await request(app.server)
          .delete(`/meals/${meal.id}`)
          .set('Cookie', cookies)
          .expect(200)

        const [mealsCount] = await knex('meals').count({ count: '*' })

        expect(mealsCount.count).toBe(0)
      })
    })
  })
})
