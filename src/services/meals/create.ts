import { Meal } from '../../entities/meal'
import { MealsRepository } from '../../repositories/meals'

interface CreateMealRequest {
  name: string
  description: string
  partOfDiet: boolean
  time: string
  userId: string
}

interface CreateMealResponse {
  meal: Meal
}

export class CreateMealService {
  constructor(private mealsRepository: MealsRepository) {}

  async execute({
    name,
    description,
    partOfDiet,
    time,
    userId,
  }: CreateMealRequest): Promise<CreateMealResponse> {
    const meal = new Meal({
      name,
      description,
      partOfDiet,
      time: new Date(time),
      userId,
    })

    await this.mealsRepository.create(meal)

    return { meal }
  }
}
