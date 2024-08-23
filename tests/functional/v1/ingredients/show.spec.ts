import Ingredient from '#models/ingredient'
import { test } from '@japa/runner'

test.group('Ingredients show', () => {
  test('Open api spec', async ({ client }) => {
    const ingredient = await Ingredient.firstOrFail()
    const response = await client.get(`/api/v1/ingredients/${ingredient.id}`)
    response.assertAgainstApiSpec()
  })

  test('Contains all data', async ({ client }) => {
    const ingredient = await Ingredient.firstOrFail()
    const response = await client.get(`/api/v1/ingredients/${ingredient.id}`)
    response.assertBody({
      data: ingredient.serialize(),
    })
  })
})
