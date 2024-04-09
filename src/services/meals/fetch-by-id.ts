import { Meal } from '../../entities/meal'
import { NotFoundError } from '../../errors/not-found'
import { MealsRepository } from '../../repositories/meals'

interface FetchMealByIdRequest {
  id: string
  userId: string
}

interface FetchMealByIdResponse {
  meal: Meal
}

export class FetchMealByIdService {
  constructor(private mealsRepository: MealsRepository) {}

  async execute({
    id,
    userId,
  }: FetchMealByIdRequest): Promise<FetchMealByIdResponse> {
    const meal = await this.mealsRepository.findById(id, userId)

    if (!meal) throw new NotFoundError('Resource not found')

    return { meal }
  }
}
