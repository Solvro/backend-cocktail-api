import Ingredient from '#models/ingredient'
import type { HttpContext } from '@adonisjs/core/http'

export default class IngredientsController {
  /**
   * Try to find ingredient and return it.
   * Serialization takes care of the rest.
   */
  async show({ request }: HttpContext) {
    const ingredient = await Ingredient.findOrFail(request.param('id'))
    return { data: ingredient }
  }

  /**
   * Display listing of all ingredients.
   * Apply filtering and sorting.
   */
  async index({ request }: HttpContext) {
    const ingredients = await Ingredient.query()
      .withScopes((scopes) => {
        scopes.handleSortQuery(request.input('sort'))
        scopes.handleSearchQuery(
          request.only([
            'id',
            'name',
            'description',
            'alcohol',
            'type',
            'percentage',
            'imageUrl',
            'createdAt',
            'updatedAt',
          ])
        )
      })
      .paginate(request.input('page'), request.input('perPage', 15))

    return ingredients
  }
}
