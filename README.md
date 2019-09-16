# typeorm-global-scopes

A decorator for [TypeORM](https://github.com/typeorm/typeorm) entities that allow default global query scopes to entities. It works by patching TypeORM's SelectQueryBuilder so it executes the default scopes that you have defined. This package was created because TypeORM currently does not support scopes on entity definition and it's highly experimental.

## Installation

```shell
npm install --save typeorm-global-scopes
```

Or

```shell
yarn add typeorm-global-scopes
```

## Usage

### Initialization

To use it, first, you need to call the patch on your app bootstrap process.

```typescript
import { patchSelectQueryBuilder } from 'typeorm-global-scopes'
...
patchSelectQueryBuilder()
...
app = express()
```

### Scope Definition

To define the scopes in an entity you need to add the `@GlobalScopes([...scopes])` decorator before the `@Entity()`. You can pass an array of query scopes to execute.

```typescript
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm'
import { GlobalScopes } from 'typeorm-global-scopes'

@GlobalScopes<Post>([
  (qb, alias) => qb.andWhere(`${alias}.author = :author`, { author: 'Carlos' })
])
@Entity()
export class Post {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  title: string

  @Column()
  text: string

  @Column()
  author: string
}
```

### Querying

There shouldn't be any changes in your services or repositories. You can use the `EntityManager` or any `Repository` or `CustomRepository` and the scopes will automatically be added to the resulting query. It will also work with queries created using the `QueryBuilder`. For example, the following snippet

```typescript
getManager().find(Post, { where: { title: Equal('The title') } })
```

will produce an SQL query like

```sql
SELECT `Post`.`id` AS `Post_id`, `Post`.`title` AS `Post_title`, `Post`.`text` AS `Post_text`, `Post`.`author` AS `Post_author` FROM `post` `Post` WHERE `Post`.`title` = ? AND `Post`.`author` = ?
-- PARAMETERS: ["The title","Carlos"]
```

### Disabling scopes

If you need to disable the scope you can use the helper function `unscoped` to disable the global scopes for that query.

```typescript
import { unscoped } from 'typeorm-global-scopes'

getManager().find(unscoped(connection, Post), { where: { title: Equal('The title') } })
```
