import { IngredientType } from '../enums/ingredient_type.js'

export default class IngredientTypesController {
  async handle() {
    return { data: Object.values(IngredientType) }
  }
}
