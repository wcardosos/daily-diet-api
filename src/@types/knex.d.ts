// eslint-disable-next-line
import { Knex } from 'knex'
import { Meal, User } from 'src/@types/models'

declare module 'knex/types/tables' {
  export interface Tables {
    users: User
    meals: Meal
  }
}
