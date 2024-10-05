import { BaseCommand, args } from '@adonisjs/core/ace'
import type { CommandOptions } from '@adonisjs/core/types/ace'
import useIdsIterator from '../app/hooks/use_ids_iterator.js'
import { sleep } from '../app/hooks/sleep.js'
import Cocktail from '#models/cocktail'
import slug from 'slug'
import drive from '@adonisjs/drive/services/main'
import { Readable } from 'stream'
import Ingredient from '#models/ingredient'
import { CocktailCategory } from '../app/enums/cocktail_category.js'
import { CocktailGlass } from '../app/enums/cocktail_glass.js'
import { ReadableStream } from 'stream/web'

type CocktailResponse = {
  idDrink: string
  strDrink: string
  strTags: string
  strCategory: CocktailCategory
  strIBA: string
  strAlcoholic: 'Alcoholic' | 'Non Alcoholic'
  strGlass: CocktailGlass
  strInstructions: string
  strInstructionsDE: string
  strDrinkThumb: string
  strIngredient1: string | null
  strIngredient2: string | null
  strIngredient3: string | null
  strIngredient4: string | null
  strIngredient5: string | null
  strIngredient6: string | null
  strIngredient7: string | null
  strIngredient8: string | null
  strIngredient9: string | null
  strIngredient10: string | null
  strIngredient11: string | null
  strIngredient12: string | null
  strIngredient13: string | null
  strIngredient14: string | null
  strIngredient15: string | null
  strMeasure1: string | null
  strMeasure2: string | null
  strMeasure3: string | null
  strMeasure4: string | null
  strMeasure5: string | null
  strMeasure6: string | null
  strMeasure7: string | null
  strMeasure8: string | null
  strMeasure9: string | null
  strMeasure10: string | null
  strMeasure11: string | null
  strMeasure12: string | null
  strMeasure13: string | null
  strMeasure14: string | null
  strMeasure15: string | null
}

export default class SynchronizeCocktails extends BaseCommand {
  static commandName = 'synchronize:cocktails'
  static description = ''

  static options: CommandOptions = {
    startApp: true,
  }

  @args.spread({
    required: false,
  })
  declare ids: string[]

  async run() {
    const animation = this.logger.await('Synchronizing cocktails')
    animation.start()
    for (let id of useIdsIterator(this.ids, 11000, 13000)) {
      try {
        await sleep(200) //because of thecocktaildb rate limit
        const drink = await this.fetchDrinkById(id)
        if (!drink) continue

        animation.update('Synchronizing cocktails', {
          suffix: drink.strDrink,
        })

        await this.createOrUpdateCocktail(drink)
        await this.storeCocktailImage(drink)
      } catch (error) {
        this.logger.error(error)
      }
    }

    animation.update('Synchronizing ingredients')
    animation.stop()
    this.logger.success('Cocktails successfully synchronized')
  }

  /**
   * Fetch drink details by id using thecocktaildb api
   * @param id
   */
  async fetchDrinkById(id: number): Promise<CocktailResponse | null> {
    const response = await fetch(`https://thecocktaildb.com/api/json/v1/1/lookup.php?i=${id}`)
    if (!response.ok) return null
    const { drinks } = await (response.json() as Promise<{ drinks: CocktailResponse[] }>)
    if (!drinks) return null
    const [drink] = drinks
    if (!drink) return null

    return drink
  }

  /**
   * Create or update cocktail base on idDrink.
   * Process ingredients. If one does not exists, create it based on name.
   * @param drink
   */
  async createOrUpdateCocktail(drink: CocktailResponse): Promise<Cocktail> {
    const cocktail = await Cocktail.updateOrCreate(
      {
        id: Number(drink.idDrink),
      },
      {
        name: drink.strDrink,
        category: drink.strCategory,
        alcoholic: drink.strAlcoholic === 'Alcoholic',
        glass: drink.strGlass,
        instructions: drink.strInstructions,
        imageUrl: `https://${process.env.APP_DOMAIN}/images/cocktails/${slug(drink.strDrink)}.png`,
      }
    )

    const cocktailIngredients: Record<number, { measure: string | null }> = {}
    for (let i = 1; i <= 15; i++) {
      const ingredientName = drink[`strIngredient${i}` as keyof CocktailResponse]
      if (!ingredientName) continue
      const ingredient = await Ingredient.firstOrCreate({ name: ingredientName })
      cocktailIngredients[ingredient.id] = {
        measure: drink[`strMeasure${i}` as keyof CocktailResponse],
      }
    }

    await cocktail.related('ingredients').sync(cocktailIngredients)

    return cocktail
  }

  /**
   * Store cocktail image on local file system based on strDrinkThumb
   * @param drink
   */
  async storeCocktailImage(drink: CocktailResponse) {
    const imageResponse = await fetch(drink.strDrinkThumb)

    await drive
      .use('cocktails')
      .putStream(
        `${slug(drink.strDrink)}.png`,
        Readable.fromWeb(imageResponse.body as ReadableStream<any>)
      )
  }
}
