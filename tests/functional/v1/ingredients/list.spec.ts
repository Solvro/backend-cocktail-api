import Ingredient from '#models/ingredient'
import { test } from '@japa/runner'
import { IngredientType } from '../../../../app/enums/ingredient_type.js'

test.group('Ingredients list', () => {
  test('Open api spec', async ({ client }) => {
    const response = await client.get('/api/v1/ingredients')
    response.assertAgainstApiSpec()
  })

  test('Sorting by id', async ({ client }) => {
    const response = await client.get('/api/v1/ingredients?sort=-id')
    const ingredient = await Ingredient.query().orderBy('id', 'desc').firstOrFail()
    response.assertStatus(200)
    response.assertBodyContains({ data: [{ id: ingredient.id }] })
  })

  test('Filtering by name strict', async ({ client }) => {
    const ingredient = await Ingredient.query().orderBy('id', 'desc').firstOrFail()
    const response = await client.get(`/api/v1/ingredients?name=${ingredient.name}`)
    response.assertStatus(200)
    response.assertBodyContains({ data: [{ id: ingredient.id }] })
  })

  test('Filtering by type list', async ({ assert, client }) => {
    const types = Object.values(IngredientType)
    const response = await client.get(`/api/v1/ingredients?type[]=${types[0]}&type[]=${types[1]}`)
    response.assertStatus(200)
    const { data } = response.body()
    for (const ingredient of data) {
      assert.oneOf(ingredient.type, [types[0], types[1]])
    }
  })

  test('Filtering by percentage range', async ({ assert, client }) => {
    const response = await client.get(`/api/v1/ingredients?percentage[from]=20&percentage[to]=30`)
    response.assertStatus(200)
    const { data } = response.body()
    for (const ingredient of data) {
      assert.isAbove(ingredient.percentage, 19)
      assert.isBelow(ingredient.percentage, 31)
    }
  })

  test('Filtering by description contains (backwards compatibility with %)', async ({ assert, client }) => {
    const response = await client.get(`/api/v1/ingredients?description=%Vodka%`)
    response.assertStatus(200)
    const { data } = response.body()
    for (const ingredient of data) {
      assert.include(ingredient.description.toLowerCase(), 'vodka')
    }
  })

  test('Filtering by description contains (auto-% addition)', async ({ assert, client }) => {
    const response = await client.get(`/api/v1/ingredients?description=Vodka`)
    response.assertStatus(200)
    const { data } = response.body()
    for (const ingredient of data) {
      assert.include(ingredient.description.toLowerCase(), 'vodka')
    }
  })

  test('Filtering by name contains (auto-% addition)', async ({ assert, client }) => {
    // Find an ingredient and get a substring of its name for partial matching
    const ingredient = await Ingredient.query().firstOrFail()
    const partialName = ingredient.name.substring(1, ingredient.name.length - 1) // Get middle part
    if (partialName.length > 2) {
      const response = await client.get(`/api/v1/ingredients?name=${partialName}`)
      response.assertStatus(200)
      const { data } = response.body()
      for (const foundIngredient of data) {
        assert.include(foundIngredient.name.toLowerCase(), partialName.toLowerCase())
      }
    }
  })

  test('Filtering by description prefix (backwards compatibility with %)', async ({ assert, client }) => {
    const response = await client.get(`/api/v1/ingredients?description=Vodka%`)
    response.assertStatus(200)
    const { data } = response.body()
    for (const ingredient of data) {
      assert.match(ingredient.description.toLowerCase(), /^vodka/)
    }
  })

  test('Pagination page size', async ({ assert, client }) => {
    const response = await client.get(`/api/v1/ingredients?perPage=5`)
    response.assertStatus(200)
    const { data } = response.body()
    assert.lengthOf(data, 5)
  })
})
