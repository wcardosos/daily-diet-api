import { describe, afterAll, beforeAll, it, beforeEach, expect } from 'vitest'
import request from 'supertest'
import { execSync } from 'node:child_process'
import { app } from '../src/app'

describe('Users routes', () => {
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

  describe('[POST] /register', () => {
    it('should create an user and set session id in cookies', async () => {
      const response = await request(app.server).post('/register').send({
        fullName: 'Test',
        email: 'test@test.com',
        password: 'test1234',
      })

      expect(response.statusCode).toBe(201)
      expect(response.get('Set-Cookie')).toHaveLength(1)
    })
  })

  describe('[POST] /login', () => {
    it('should login an user and set session id in cookies', async () => {
      await request(app.server).post('/register').send({
        fullName: 'Test',
        email: 'test@test.com',
        password: 'test1234',
      })

      const response = await request(app.server).post('/login').send({
        email: 'test@test.com',
        password: 'test1234',
      })

      expect(response.statusCode).toBe(200)
      expect(response.get('Set-Cookie')).toHaveLength(1)
    })
  })
})
