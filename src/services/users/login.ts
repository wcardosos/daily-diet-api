import { UsersRepository } from '../../repositories/users'

interface LoginUserRequest {
  email: string
  password: string
}

interface LoginUserResponse {
  sessionId: string
}

export class LoginUserService {
  constructor(private usersRepository: UsersRepository) {}

  async execute({
    email,
    password,
  }: LoginUserRequest): Promise<LoginUserResponse> {
    const user = await this.usersRepository.findByEmail(email)

    if (!user) throw new Error('Invalid credentials')

    if (!(await user.isCorrectPassword(password)))
      throw new Error('Invalid credentials')

    user.generateSessionId()

    return { sessionId: user.sessionId }
  }
}
