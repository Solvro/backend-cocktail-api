import { test } from '@japa/runner'
import { IngredientType } from '../../../../app/enums/ingredient_type.js'

test.group('Ingredients types', () => {
  test('Open api spec', async ({ client }) => {
    const response = await client.get(`/api/v1/ingredients/types`)
    response.assertAgainstApiSpec()
  })

  test('Contains all types', async ({ client }) => {
    const response = await client.get(`/api/v1/ingredients/types`)
    response.assertBody({
      data: Object.values(IngredientType),
    })
  })
})
