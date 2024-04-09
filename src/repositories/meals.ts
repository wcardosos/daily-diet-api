import { knex } from '../database'
import { Meal, Props as MealsProps } from '../entities/meal'

export class MealsRepository {
  async findAll(userId: string, orderBy?: keyof MealsProps): Promise<Meal[]> {
    const meals = await knex('meals')
      .select('*')
      .where('user_id', userId)
      .orderBy(orderBy || 'created_at')

    return meals.map(
      (meal) =>
        new Meal(
          {
            name: meal.name,
            description: meal.description,
            partOfDiet: Boolean(meal.part_of_diet),
            time: new Date(meal.time),
            userId,
          },
          meal.id,
        ),
    )
  }

  async findById(id: string, userId: string): Promise<Meal | null> {
    const [meal] = await knex('meals').select('*').where({
      id,
      user_id: userId,
    })

    if (!meal) return null

    return new Meal(
      {
        name: meal.name,
        description: meal.description,
        partOfDiet: meal.part_of_diet,
        time: new Date(meal.time),
        userId,
      },
      meal.id,
    )
  }

  async create(meal: Meal): Promise<void> {
    await knex('meals').insert({
      id: meal.id,
      name: meal.name,
      description: meal.description,
      part_of_diet: meal.partOfDiet,
      time: meal.time.toISOString(),
      user_id: meal.userId,
    })
  }

  async update(meal: Meal): Promise<void> {
    await knex('meals')
      .update({
        name: meal.name,
        description: meal.description,
        part_of_diet: meal.partOfDiet,
        time: meal.time.toISOString(),
        updated_at: new Date().toISOString(),
      })
      .where({ id: meal.id, user_id: meal.userId })
  }

  async delete(id: string, userId: string): Promise<void> {
    await knex('meals').delete().where({
      id,
      user_id: userId,
    })
  }

  async count(userId: string): Promise<number> {
    const [mealsCount] = await knex('meals')
      .where('user_id', userId)
      .count({ count: '*' })

    return Number(mealsCount.count)
  }

  async countInDiet(userId: string): Promise<number> {
    const [mealsInDiet] = await knex('meals')
      .where({
        part_of_diet: true,
        user_id: userId,
      })
      .count({ count: '*' })

    return Number(mealsInDiet.count)
  }

  async countOffDiet(userId: string): Promise<number> {
    const [mealsOffDiet] = await knex('meals')
      .where({
        part_of_diet: false,
        user_id: userId,
      })
      .count({ count: '*' })

    return Number(mealsOffDiet.count)
  }
}
