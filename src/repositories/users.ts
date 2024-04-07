import { knex } from '../database'
import { User } from '../entities/user'

export class UsersRepository {
  async create(user: User): Promise<void> {
    await knex('users').insert({
      id: user.id,
      full_name: user.fullName,
      email: user.email,
      password: user.password,
      session_id: user.sessionId,
    })
  }

  async findByEmail(email: string): Promise<User | null> {
    const [user] = await knex('users').select('*').where('email', email)

    if (!user) return null

    return new User({
      email: user.email,
      password: user.password,
      fullName: user.full_name,
      sessionId: user.session_id,
    })
  }
}
