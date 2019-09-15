import { Post } from './entities/Post'
import { Connection, Equal } from 'typeorm'
import { createTestingConnections, closeTestingConnections } from './util/testUtils'
import { patchSelectQueryBuilder } from '../src/patch-select-query-builder'
import { getPosts } from './util/getPosts'
import { unscoped } from '../src/GlobalScopes'

describe('deactivates global scope', () => {
  patchSelectQueryBuilder()
  let connections: Connection[]
  beforeAll(
    async () =>
      (connections = await createTestingConnections({
        entities: [__dirname + '/entities/*{.js,.ts}'],
        schemaCreate: true,
        dropSchema: true
      }))
  )
  beforeEach(() => {
    return Promise.all(
      connections.map(async connection => {
        await connection.manager.query('SET FOREIGN_KEY_CHECKS=0')
        await connection.manager.getRepository(Post).clear()
        await connection.manager.query('SET FOREIGN_KEY_CHECKS=1')
      })
    )
  })

  afterAll(() => closeTestingConnections(connections))

  it('gets deactivated for one query call', () =>
    Promise.all(
      connections.map(async connection => {
        await connection.manager.save(getPosts())
        let post = await connection.manager.find(unscoped(connection, Post), {
          where: { title: Equal('The title') }
        })
        expect(post.length).toEqual(2)
        post = await connection.manager.find(Post, {
          where: { title: Equal('The title') }
        })
        expect(post.length).toEqual(1)
      })
    ))
})
