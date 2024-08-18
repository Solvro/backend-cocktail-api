import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'cocktail_ingredient'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.integer('cocktail_id').references('cocktails.id')
      table.integer('ingredient_id').references('ingredients.id')
      table.string('measure').nullable()

      table.index(['cocktail_id', 'ingredient_id'])
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
