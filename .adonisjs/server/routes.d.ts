import '@adonisjs/core/types/http'

type ParamValue = string | number | bigint | boolean

export type ScannedRoutes = {
  ALL: {
    'drive.ingredients.serve': { paramsTuple: [...ParamValue[]]; params: {'*': ParamValue[]} }
    'drive.cocktails.serve': { paramsTuple: [...ParamValue[]]; params: {'*': ParamValue[]} }
    'drive.fs.serve': { paramsTuple: [...ParamValue[]]; params: {'*': ParamValue[]} }
    'ingredient_types': { paramsTuple?: []; params?: {} }
    'ingredients.index': { paramsTuple?: []; params?: {} }
    'ingredients.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'cocktail_glasses': { paramsTuple?: []; params?: {} }
    'cocktail_categories': { paramsTuple?: []; params?: {} }
    'cocktails.index': { paramsTuple?: []; params?: {} }
    'cocktails.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
  }
  GET: {
    'drive.ingredients.serve': { paramsTuple: [...ParamValue[]]; params: {'*': ParamValue[]} }
    'drive.cocktails.serve': { paramsTuple: [...ParamValue[]]; params: {'*': ParamValue[]} }
    'drive.fs.serve': { paramsTuple: [...ParamValue[]]; params: {'*': ParamValue[]} }
    'ingredient_types': { paramsTuple?: []; params?: {} }
    'ingredients.index': { paramsTuple?: []; params?: {} }
    'ingredients.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'cocktail_glasses': { paramsTuple?: []; params?: {} }
    'cocktail_categories': { paramsTuple?: []; params?: {} }
    'cocktails.index': { paramsTuple?: []; params?: {} }
    'cocktails.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
  }
  HEAD: {
    'drive.ingredients.serve': { paramsTuple: [...ParamValue[]]; params: {'*': ParamValue[]} }
    'drive.cocktails.serve': { paramsTuple: [...ParamValue[]]; params: {'*': ParamValue[]} }
    'drive.fs.serve': { paramsTuple: [...ParamValue[]]; params: {'*': ParamValue[]} }
    'ingredient_types': { paramsTuple?: []; params?: {} }
    'ingredients.index': { paramsTuple?: []; params?: {} }
    'ingredients.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'cocktail_glasses': { paramsTuple?: []; params?: {} }
    'cocktail_categories': { paramsTuple?: []; params?: {} }
    'cocktails.index': { paramsTuple?: []; params?: {} }
    'cocktails.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
  }
}
declare module '@adonisjs/core/types/http' {
  export interface RoutesList extends ScannedRoutes {}
}