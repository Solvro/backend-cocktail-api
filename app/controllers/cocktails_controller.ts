import Cocktail from '#models/cocktail'
import type { HttpContext } from '@adonisjs/core/http'

export default class CocktailsController {
  /**
   * Try to find cocktail and return it.
   * Serialization takes care of the rest.
   */
  async show({ request }: HttpContext) {
    const cocktail = await Cocktail.findOrFail(request.param('id'))
    await cocktail.load('ingredients')
    return { data: cocktail }
  }

  /**
   * Display listing of all cocktails.
   * Apply filtering and sorting.
   */
  async index({ request }: HttpContext) {
    const ingredientId = request.input('ingredientId')
    const cocktails = await Cocktail.query()
      .withScopes((scopes) => {
        scopes.handleSortQuery(request.input('sort'))
        scopes.handleSearchQuery(
          request.only([
            'id',
            'name',
            'category',
            'instructions',
            'glass',
            'percentage',
            'alcoholic',
            'createdAt',
            'updatedAt',
          ])
        )
      })
      .if(ingredientId, (query) => {
        query.whereHas('ingredients', (relationQuery) => {
          relationQuery[Array.isArray(ingredientId) ? 'whereIn' : 'where']('id', ingredientId)
        })
      })
      .paginate(request.input('page'), request.input('perPage', 15))
    return cocktails
  }
}
