import { Post } from './entities/Post'
import { Connection, Equal } from 'typeorm'
import { createTestingConnections, closeTestingConnections } from './util/testUtils'
import { getPosts } from './util/getPosts'
import { patchSelectQueryBuilder } from '../src'

describe('query using manager', () => {
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

  it('adds the global scope to find', () =>
    Promise.all(
      connections.map(async connection => {
        await connection.manager.save(getPosts())
        const post = await connection.manager.find(Post, {
          where: { title: Equal('The title') }
        })
        expect(post.length).toEqual(1)
        expect(post[0].author).toEqual('Carlos')
      })
    ))
})
