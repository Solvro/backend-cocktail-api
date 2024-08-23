import { CocktailGlass } from '../enums/cocktail_glass.js'

export default class CocktailGlassesController {
  async handle() {
    return { data: Object.values(CocktailGlass) }
  }
}
