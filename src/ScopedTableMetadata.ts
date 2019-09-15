import { TableMetadataArgs } from 'typeorm/metadata-args/TableMetadataArgs'
import { SelectQueryBuilder } from 'typeorm'

export type Scope<Entity> = (qb: SelectQueryBuilder<Entity>, alias: string) => SelectQueryBuilder<Entity>

export interface ScopedTableMetadata<Entity> extends TableMetadataArgs {
    scopes: Scope<Entity>[]
}
