import { getMetadataArgsStorage, Connection, ObjectType } from 'typeorm'
import { ScopedTableMetadata, Scope } from './ScopedTableMetadata'

export function GlobalScopes<Entity>(
  globalScopes: Scope<Entity>[],
  enabled = true
): Function {
  return function(target: Function) {
    const storage = getMetadataArgsStorage().tables.find(
      table => table.target === target
    ) as (ScopedTableMetadata<Entity> | undefined)
    if (storage) {
      storage.scopes = globalScopes
      storage.scopesEnabled = enabled
    } else {
      throw new Error(
        'Could not find current entity in metadata store, maybe put @GlobalScopes() after @Entity()?'
      )
    }
  }
}

export function unscoped<Entity>(connection: Connection, target: ObjectType<Entity>) {
  const metadata = connection.getMetadata(target)
    .tableMetadataArgs as ScopedTableMetadata<Entity>
  metadata.scopesEnabled = false
  return target
}
