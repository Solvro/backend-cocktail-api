/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/
1
import router from '@adonisjs/core/services/router'
const IngredientsController = () => import('#controllers/ingredients_controller')
const CocktailsController = () => import('#controllers/cocktails_controller')
const CocktailGlassesController = () => import('#controllers/cocktail_glasses_controller')
const CocktailCategoriesController = () => import('#controllers/cocktail_categories_controller')
const IngredientTypesController = () => import('#controllers/ingredient_types_controlles')

router
  .group(() => {
    router.get('ingredients/types', [IngredientTypesController])
    router.resource('ingredients', IngredientsController).only(['show', 'index'])

    router.get('cocktails/glasses', [CocktailGlassesController])
    router.get('cocktails/categories', [CocktailCategoriesController])
    router.resource('cocktails', CocktailsController).only(['show', 'index'])
  })
  .prefix('api/v1')
