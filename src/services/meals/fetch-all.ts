import { Meal } from '../../entities/meal'
import { MealsRepository } from '../../repositories/meals'

interface FetchAllMealsRequest {
  userId: string
}

interface FetchAllMealsResponse {
  meals: Meal[]
}

export class FetchAllMealsService {
  constructor(private mealsRepository: MealsRepository) {}

  async execute({
    userId,
  }: FetchAllMealsRequest): Promise<FetchAllMealsResponse> {
    const meals = await this.mealsRepository.findAll(userId)

    return { meals }
  }
}
