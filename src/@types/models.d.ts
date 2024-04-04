declare module 'src/@types/models' {
  export interface User {
    id: string
    full_name: string
    email: string
    password: string
    session_id: string
    created_at: string
    updated_at: string
  }

  export interface Meal {
    id: string
    name: string
    description: string
    part_of_diet: boolean
    time: string
    user_id: string
    created_at: string
    updated_at: string
  }
}
