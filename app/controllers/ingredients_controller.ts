import Ingredient from '#models/ingredient'
import type { HttpContext } from '@adonisjs/core/http'

export default class IngredientsController {
  /**
   * Try to find ingredient and return it.
   * Serialization takes care of the rest.
   */
  async show({ request }: HttpContext) {
    const ingredient = await Ingredient.findOrFail(request.param('id'))
    return ingredient
  }
}
