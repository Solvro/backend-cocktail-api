import { scope } from '@adonisjs/lucid/orm'

/**
 * Based on object of params filter query including in, from, to, like options
 */
export const handleSearchQuery = () =>
  scope((query, params: Record<string, any>) => {
    for (const param in params) {
      const value = params[param]
      if (!value) continue
      if (Array.isArray(value)) {
        query.whereIn(param, value)
      } else if (typeof value === 'object') {
        if (value.from) query.where(param, '>=', value.from)
        if (value.to ?? false) query.where(param, '<=', value.to)
      } else {
        if (Number.isNaN(Number(value))) {
          query.whereLike(param, value)
        } else [query.where(param, value)]
      }
    }
  })
