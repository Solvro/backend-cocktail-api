import Cocktail from '#models/cocktail'
import { test } from '@japa/runner'

test.group('Cocktails show', () => {
  test('Open api spec', async ({ client }) => {
    const cocktail = await Cocktail.firstOrFail()
    const response = await client.get(`/api/v1/cocktails/${cocktail.id}`)
    response.assertAgainstApiSpec()
  })

  test('Contains all data', async ({ client }) => {
    const cocktail = await Cocktail.firstOrFail()
    await cocktail.load('ingredients')
    const response = await client.get(`/api/v1/cocktails/${cocktail.id}`)
    response.assertBody({
      data: cocktail.serialize(),
    })
  })
})
