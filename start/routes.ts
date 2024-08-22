/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'
const IngredientsController = () => import('#controllers/ingredients_controller')
const CocktailsController = () => import('#controllers/cocktails_controller')

router
  .group(() => {
    router.resource('ingredients', IngredientsController).only(['show', 'index'])
    router.resource('cocktails', CocktailsController).only(['show', 'index'])
  })
  .prefix('api/v1')
