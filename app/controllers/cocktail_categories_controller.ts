import { CocktailCategory } from '../enums/cocktail_category.js'

export default class CocktailCategoriesController {
  async handle() {
    return { data: Object.values(CocktailCategory) }
  }
}
