// eslint-disable-next-line
import { Knex } from 'knex'

declare module 'knex/types/tables' {
  export interface Tables {
    meals: {
      id: string
      name: string
      description: string
      part_of_diet: boolean
      time: string
      created_at: string
      updated_at: string
    }
  }
}
