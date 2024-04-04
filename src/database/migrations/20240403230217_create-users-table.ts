import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('users', (table) => {
    table.uuid('id').primary()
    table.text('full_name').notNullable()
    table.text('email').notNullable().unique()
    table.text('password').notNullable()
    table.text('session_id').notNullable().index()
    table.timestamps(true, true)
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('users')
}
