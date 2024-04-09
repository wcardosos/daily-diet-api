import { Meal } from '../../entities/meal'
import { MealsRepository } from '../../repositories/meals'

interface GetMealsMetricsRequest {
  userId: string
}

interface GetMealsMetricsResponse {
  count: number
  inDiet: number
  offDiet: number
  bestSequence: number
  inDietPercentage: number
}

export class GetMealsMetricsService {
  constructor(private mealsRepository: MealsRepository) {}

  async execute({
    userId,
  }: GetMealsMetricsRequest): Promise<GetMealsMetricsResponse> {
    const count = await this.mealsRepository.count(userId)
    const inDiet = await this.mealsRepository.countInDiet(userId)
    const offDiet = await this.mealsRepository.countOffDiet(userId)

    const mealsByTime = await this.mealsRepository.findAll(userId, 'time')

    const bestSequence = this.calculateBestSequence(mealsByTime)

    return {
      count,
      inDiet,
      offDiet,
      bestSequence,
      inDietPercentage: Number(((inDiet / count) * 100).toFixed(1)),
    }
  }

  private calculateBestSequence(mealsByTime: Meal[]): number {
    let bestSequence = 0
    let currentSequence = 0

    mealsByTime.forEach((meal) => {
      if (meal.partOfDiet) currentSequence++
      else {
        if (currentSequence > bestSequence) bestSequence = currentSequence
        currentSequence = 0
      }
    })

    if (currentSequence > bestSequence) bestSequence = currentSequence

    return bestSequence
  }
}
