import Ingredient from '#models/ingredient'
import app from '@adonisjs/core/services/app'
import { BaseSeeder } from '@adonisjs/lucid/seeders'
import fs from 'fs'
export default class extends BaseSeeder {
  async run() {
    const ingredients = fs.readFileSync(app.seedersPath('../data/ingredients.json'))
    await Ingredient.createMany(JSON.parse(ingredients))
  }
}
