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

router
  .group(() => {
    router.resource('ingredients', IngredientsController).only(['show', 'index'])
  })
  .prefix('api/v1')
