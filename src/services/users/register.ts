import { UsersRepository } from '../../repositories/users'
import { User } from '../../entities/user'

interface RegisterUserRequest {
  fullName: string
  email: string
  password: string
}

interface RegisterUserResponse {
  sessionId: string
}

export class RegisterUserService {
  constructor(private usersRepository: UsersRepository) {}

  async execute({
    fullName,
    email,
    password,
  }: RegisterUserRequest): Promise<RegisterUserResponse> {
    const user = new User({
      fullName,
      email,
      password,
    })

    await user.encryptPassword()
    user.generateSessionId()

    await this.usersRepository.create(user)

    return { sessionId: user.sessionId }
  }
}
