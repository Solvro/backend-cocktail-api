import { test } from '@japa/runner'
import { CocktailGlass } from '../../../../app/enums/cocktail_glass.js'

test.group('Cocktail glasses', () => {
  test('Open api spec', async ({ client }) => {
    const response = await client.get(`/api/v1/cocktails/glasses`)
    response.assertAgainstApiSpec()
  })

  test('Contains all glasses', async ({ client }) => {
    const response = await client.get(`/api/v1/cocktails/glasses`)
    response.assertBody({
      data: Object.values(CocktailGlass),
    })
  })
})
