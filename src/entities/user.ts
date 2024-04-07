import { randomUUID } from 'node:crypto'
import { Entity } from './entity'
import bcrypt from 'bcrypt'

interface Props {
  fullName: string
  email: string
  password: string
  sessionId?: string
}

export interface MappedUser extends Props {
  id: string
}

export class User extends Entity<Props> {
  get fullName() {
    return this.props.fullName
  }

  get email() {
    return this.props.email
  }

  get password() {
    return this.props.password
  }

  get sessionId(): string {
    return this.props.sessionId as string
  }

  async encryptPassword() {
    const hashedPassword = await bcrypt.hash(this.password, 10)

    this.props.password = hashedPassword
  }

  async isCorrectPassword(unhashedPassword: string) {
    return bcrypt.compare(unhashedPassword, this.password)
  }

  async generateSessionId() {
    const newSessionId = randomUUID()
    this.props.sessionId = newSessionId

    return newSessionId
  }

  toJson(): MappedUser {
    return {
      id: this.id,
      fullName: this.fullName,
      email: this.email,
      password: this.email,
      sessionId: this.sessionId,
    }
  }
}
