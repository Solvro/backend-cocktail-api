import { BaseCommand, args } from '@adonisjs/core/ace'
import type { CommandOptions } from '@adonisjs/core/types/ace'
import useIdsIterator from '../app/hooks/use_ids_iterator.js'
import { sleep } from '../app/hooks/sleep.js'
import Ingredient from '#models/ingredient'
import { IngredientType } from '../app/enums/ingredient_type.js'
import slug from 'slug'
import drive from '@adonisjs/drive/services/main'
import { Readable } from 'stream'
import { ReadableStream } from 'stream/web'
import db from '@adonisjs/lucid/services/db'

type IngredientResponse = {
  idIngredient: string
  strIngredient: string
  strDescription: string
  strType: string
  strAlcohol: 'No' | 'Yes'
  strABV: number
}

export default class SynchronizeIngredients extends BaseCommand {
  static commandName = 'synchronize:ingredients'
  static description =
    'Using thecocktaildb synchronize ingredients. By default synchronize all, but you can add specific ids as param.'

  static options: CommandOptions = {
    startApp: true,
  }

  @args.spread({
    required: false,
  })
  declare ids: string[]

  /**
   * Using custom iterator go through supplied ids or fixed range and fetch ingredients details.
   * Create or update ingredient identifiable by id (maybe should be name?).
   * Save ingredient image to local drive.
   */
  async run() {
    const animation = this.logger.await('Synchronizing ingredients')
    animation.start()

    for (let id of useIdsIterator(this.ids, 0, 1000)) {
      try {
        await sleep(200) //because of thecocktaildb rate limit
        const ingredient = await this.fetchIngredientById(id)
        if (!ingredient) continue

        animation.update('Synchronizing ingredients', {
          suffix: ingredient.strIngredient,
        })

        await this.createOrUpdateIngredient(ingredient)
        await this.storeIngredientImage(ingredient)
      } catch (error) {
        this.logger.error(error)
      }
    }

    // While synchronizing ingredients we use id provided by thecocktaildb to create and update ingredients/
    // This may cause postgresql auto-increment table sequence to fall out of sync, so we need to reset it manually.
    await db.rawQuery(
      "SELECT pg_catalog.setval(pg_get_serial_sequence('ingredients', 'id'), MAX(id)) FROM ingredients;"
    )

    animation.update('Synchronizing ingredients')
    animation.stop()
    this.logger.success('Ingredients successfully synchronized')
  }

  /**
   * Fetch ingredient details by id using thecocktaildb api
   * @param id
   * @returns ingredient
   */
  async fetchIngredientById(id: number): Promise<IngredientResponse | null> {
    const response = await fetch(`https://thecocktaildb.com/api/json/v1/1/lookup.php?iid=${id}`)
    if (!response.ok) return null

    const { ingredients } = await (response.json() as Promise<{
      ingredients: IngredientResponse[]
    }>)

    if (!ingredients) return null
    const [ingredient] = ingredients
    if (!ingredient) return null

    return ingredient
  }

  /**
   * Create or update ingredient identifiable by id (maybe should be name?).
   * Save ingredient image to local drive.
   * @param ingredient
   */
  async createOrUpdateIngredient(ingredient: IngredientResponse) {
    await Ingredient.updateOrCreate(
      {
        id: Number(ingredient.idIngredient),
      },
      {
        name: ingredient.strIngredient,
        description: ingredient.strDescription,
        type: this.matchIngredientType(ingredient?.strType?.trim() ?? null),
        alcohol: ingredient.strAlcohol === 'Yes',
        percentage: ingredient.strABV,
        imageUrl: `https://${process.env.APP_DOMAIN}/images/ingredients/${slug(ingredient.strIngredient)}.png`,
      }
    )
  }

  /**
   * Because of some minor mistakes in categories we needed to implement custom directory for some names.
   * @param type
   * @returns
   */
  matchIngredientType(type: string): IngredientType {
    return ({
      'Fortified wine': 'Fortified Wine',
      'aperitif': 'Aperitif',
    }[type] ?? type) as IngredientType
  }

  /**
   * Store ingredient image on local file system based on strIngredient
   * @param drink
   */
  async storeIngredientImage(ingredient: IngredientResponse) {
    const imageResponse = await fetch(
      `https://thecocktaildb.com/images/ingredients/${ingredient.strIngredient}.png`
    )
    await drive
      .use('ingredients')
      .putStream(
        `${slug(ingredient.strIngredient)}.png`,
        Readable.fromWeb(imageResponse.body as ReadableStream<any>)
      )
  }
}
