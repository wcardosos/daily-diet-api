import { randomUUID } from 'node:crypto'

export abstract class Entity<Props> {
  protected props: Props
  public id: string

  constructor(props: Props, id?: string) {
    this.props = props
    this.id = id ?? randomUUID()
  }

  abstract toJson(): unknown
}
