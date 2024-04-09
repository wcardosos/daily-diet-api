import { Meal } from '../../entities/meal'
import { MealsRepository } from '../../repositories/meals'

interface UpdateMealRequest {
  id: string
  name: string
  description: string
  partOfDiet: boolean
  time: string
  userId: string
}

interface UpdateMealResponse {
  meal: Meal
}

export class UpdateMealService {
  constructor(private mealsRepository: MealsRepository) {}

  async execute({
    id,
    name,
    description,
    partOfDiet,
    time,
    userId,
  }: UpdateMealRequest): Promise<UpdateMealResponse> {
    const meal = new Meal(
      {
        name,
        description,
        partOfDiet,
        time: new Date(time),
        userId,
      },
      id,
    )

    await this.mealsRepository.update(meal)

    return { meal }
  }
}
