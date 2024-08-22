import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'
import { IngredientType } from '../enums/ingredient_type.js'

export default class Ingredient extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare name: string

  @column()
  declare description: string

  @column()
  declare alcohol: boolean

  @column()
  declare type: IngredientType

  @column()
  declare percentage: number

  @column()
  declare imageUrl: string

  @column.dateTime({
    autoCreate: true,
    serialize: (value) => value.toFormat('yyyy-LL-dd HH:mm:ss'),
  })
  declare createdAt: DateTime

  @column.dateTime({
    autoCreate: true,
    autoUpdate: true,
    serialize: (value) => value.toFormat('yyyy-LL-dd HH:mm:ss'),
  })
  declare updatedAt: DateTime

  serializeExtras() {
    return this.$extras?.pivot_measure ? { measure: this.$extras.pivot_measure } : {}
  }
}
