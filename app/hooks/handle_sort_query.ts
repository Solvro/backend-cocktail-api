import { scope } from '@adonisjs/lucid/orm'
import { LucidModel } from '@adonisjs/lucid/types/model'

/**
 * Based on sort string apply sorting.
 * First character should be +- determining sorting type.
 */
export const handleSortQuery = <T extends LucidModel>(model: T) =>
  scope((query, sort: string) => {
    if (!sort) return
    const value = sort.slice(1)
    if (!model.$hasColumn(value)) return
    query.orderBy(value, sort[0] === '-' ? 'desc' : 'asc')
    return query
  })
