import { getMetadataArgsStorage } from 'typeorm'
import { ScopedTableMetadata, Scope } from './ScopedTableMetadata'

export function GlobalScopes<Entity>(globalScopes: Scope<Entity>[]): Function {
    return function(target: Function) {
        const storage = getMetadataArgsStorage().tables.find(table => table.target === target) as (
            | ScopedTableMetadata<Entity>
            | undefined)
        if (storage) {
            storage.scopes = globalScopes
        } else {
            throw new Error(
                'Could not find current entity in metadata store, maybe put @GlobalScopes() after @Entity()?',
            )
        }
    }
}
