import { BaseSchema } from '@adonisjs/lucid/schema'
import { CocktailCategory } from '../../app/enums/cocktail_category.js'
import { CocktailGlass } from '../../app/enums/cocktail_glass.js'

export default class extends BaseSchema {
  protected tableName = 'cocktails'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      table.string('name')

      table
        .enum('category', Object.values(CocktailCategory), {
          useNative: true,
          enumName: 'cocktail_category',
        })
        .defaultTo(CocktailCategory.OtherUnknown)

      table
        .enum('glass', Object.values(CocktailGlass), {
          useNative: true,
          enumName: 'cocktail_glass',
        })
        .nullable()

      table.text('instructions').nullable()
      table.string('image_url').nullable()
      table.boolean('alcoholic').defaultTo(true)

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
    this.schema.raw('DROP TYPE IF EXISTS "cocktail_category"')
    this.schema.raw('DROP TYPE IF EXISTS "cocktail_glass"')
  }
}
