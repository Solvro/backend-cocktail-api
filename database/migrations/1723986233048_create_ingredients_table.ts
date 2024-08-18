import { BaseSchema } from '@adonisjs/lucid/schema'
import { IngredientType } from '../../app/enums/ingredient_type.js'

export default class extends BaseSchema {
  protected tableName = 'ingredients'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      table.string('name')
      table.text('description').nullable()
      table.boolean('alcohol').defaultTo(true)

      table
        .enum('type', Object.values(IngredientType), {
          useNative: true,
          enumName: 'ingredient_type',
        })
        .nullable()

      table.integer('percentage').nullable()
      table.string('image_url').nullable()

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
    this.schema.raw('DROP TYPE IF EXISTS "ingredient_type"')
  }
}
