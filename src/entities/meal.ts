import { Entity } from './entity'

export interface Props {
  name: string
  description: string
  partOfDiet: boolean
  time: Date
  userId: string
}

export class Meal extends Entity<Props> {
  get name() {
    return this.props.name
  }

  get description() {
    return this.props.description
  }

  get partOfDiet() {
    return this.props.partOfDiet
  }

  get time() {
    return this.props.time
  }

  get userId() {
    return this.props.userId
  }

  toJson() {
    return {
      id: this.id,
      name: this.name,
      description: this.description,
      partOfDiet: Boolean(this.partOfDiet),
      time: this.time,
    }
  }
}
