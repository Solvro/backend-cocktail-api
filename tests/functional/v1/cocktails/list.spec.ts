import Cocktail from '#models/cocktail'
import { test } from '@japa/runner'
import { CocktailCategory } from '../../../../app/enums/cocktail_category.js'
import Ingredient from '#models/ingredient'

test.group('Cocktails list', () => {
  test('Open api spec', async ({ client }) => {
    const response = await client.get('/api/v1/cocktails')
    response.assertAgainstApiSpec()
  })

  test('Sorting by id', async ({ client }) => {
    const response = await client.get('/api/v1/cocktails?sort=+id')
    const cocktail = await Cocktail.query().orderBy('id', 'asc').firstOrFail()
    response.assertStatus(200)
    response.assertBodyContains({ data: [{ id: cocktail.id }] })
  })

  test('Filtering by name strict', async ({ client }) => {
    const cocktail = await Cocktail.query().orderBy('id', 'desc').firstOrFail()
    const response = await client.get(`/api/v1/cocktails?name=${cocktail.name}`)
    response.assertStatus(200)
    response.assertBodyContains({ data: [{ id: cocktail.id }] })
  })

  test('Filtering by category list', async ({ assert, client }) => {
    const categories = Object.values(CocktailCategory)
    const response = await client.get(
      `/api/v1/cocktails?category[]=${categories[0]}&category[]=${categories[1]}`
    )
    response.assertStatus(200)
    const { data } = response.body()
    for (const cocktail of data) {
      assert.oneOf(cocktail.category, [categories[0], categories[1]])
    }
  })

  test('Filtering by instruction contains', async ({ assert, client }) => {
    const response = await client.get(`/api/v1/cocktails?instructions=%chilled glass%`)
    response.assertStatus(200)
    const { data } = response.body()
    for (const cocktail of data) {
      assert.include(cocktail.instructions, 'chilled glass')
    }
  })

  test('Filtering by has ingredient', async ({ assert, client }) => {
    const ingredient = await Ingredient.firstOrFail()
    const response = await client.get(
      `/api/v1/cocktails?ingredientId=${ingredient.id}&ingredients=true`
    )
    response.assertStatus(200)
    const { data } = response.body()
    for (const cocktail of data) {
      assert.containsSubset(cocktail.ingredients, [{ id: ingredient.id }])
    }
  })
})
