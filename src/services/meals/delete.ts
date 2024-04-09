import { MealsRepository } from '../../repositories/meals'

interface DeleteMealRequest {
  id: string
  userId: string
}

export class DeleteMealService {
  constructor(private mealsRepository: MealsRepository) {}

  async execute({ id, userId }: DeleteMealRequest): Promise<void> {
    await this.mealsRepository.delete(id, userId)
  }
}
