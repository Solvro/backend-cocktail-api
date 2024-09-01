import { DateTime } from 'luxon'
import { BaseModel, column, manyToMany } from '@adonisjs/lucid/orm'
import Ingredient from './ingredient.js'
import type { ManyToMany } from '@adonisjs/lucid/types/relations'
import { CocktailCategory } from '../enums/cocktail_category.js'
import { CocktailGlass } from '../enums/cocktail_glass.js'
import { handleSearchQuery } from '../hooks/handle_search_query.js'
import { handleSortQuery } from '../hooks/handle_sort_query.js'

export default class Cocktail extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare name: string

  @column()
  declare category: CocktailCategory

  @column()
  declare glass: CocktailGlass

  @column()
  declare instructions: string

  @column()
  declare imageUrl: string

  @column()
  declare alcoholic: boolean

  static handleSearchQuery = handleSearchQuery<typeof Cocktail>()

  static handleSortQuery = handleSortQuery<typeof Cocktail>(this)

  @manyToMany(() => Ingredient, {
    pivotColumns: ['measure'],
    pivotTimestamps: false,
  })
  declare ingredients: ManyToMany<typeof Ingredient>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
