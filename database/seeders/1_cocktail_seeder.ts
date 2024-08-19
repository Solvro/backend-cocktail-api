import Cocktail from '#models/cocktail'
import Ingredient from '#models/ingredient'
import app from '@adonisjs/core/services/app'
import { BaseSeeder } from '@adonisjs/lucid/seeders'
import db from '@adonisjs/lucid/services/db'
import fs from 'fs'

export default class extends BaseSeeder {
  async run() {
    const cocktails = JSON.parse(fs.readFileSync(app.seedersPath('../data/cocktails.json')))
    await Cocktail.createMany(cocktails)
    await db
      .table('cocktail_ingredient')
      .insert(cocktails.map((cocktail) => cocktail.ingredients).flat(1))
  }
}
