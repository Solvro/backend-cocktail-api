import { test } from '@japa/runner'
import { CocktailCategory } from '../../../../app/enums/cocktail_category.js'

test.group('Cocktail categories', () => {
  test('Open api spec', async ({ client }) => {
    const response = await client.get(`/api/v1/cocktails/categories`)
    response.assertAgainstApiSpec()
  })

  test('Contains all categories', async ({ client }) => {
    const response = await client.get(`/api/v1/cocktails/categories`)
    response.assertBody({
      data: Object.values(CocktailCategory),
    })
  })
})
