import { Post } from './entities/Post'
import { Comment } from './entities/Comment'
import { Connection } from 'typeorm'
import { createTestingConnections, closeTestingConnections } from './util/testUtils'
import { patchSelectQueryBuilder } from '../src/patch-select-query-builder'
import { getPosts } from './util/getPosts'

describe('query using query builder', () => {
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

  afterAll(() => closeTestingConnections(connections))
  beforeEach(() => {
    return Promise.all(
      connections.map(async connection => {
        await connection.manager.query('SET FOREIGN_KEY_CHECKS=0')
        await connection.manager.getRepository(Comment).clear()
        await connection.manager.getRepository(Post).clear()
        await connection.manager.query('SET FOREIGN_KEY_CHECKS=1')
      })
    )
  })

  it('adds the global scope to query builder', () =>
    Promise.all(
      connections.map(async connection => {
        await connection.manager.save(getPosts())
        const post = await connection.manager
          .createQueryBuilder()
          .select('post')
          .from(Post, 'post')
          .where('post.title = :title', { title: 'The title' })
          .getMany()
        expect(post.length).toEqual(1)
        expect(post[0].author).toEqual('Carlos')
      })
    ))

  it('adds the global scope to subquierie', () =>
    Promise.all(
      connections.map(async connection => {
        const post = new Post()
        post.title = 'The title'
        post.text = 'The content'
        post.author = 'Carlos'
        const post2 = new Post()
        post2.title = 'The title  2'
        post2.text = 'The content 2'
        post2.author = 'Carlos'
        await connection.manager.save([post, post2])
        const comment1 = new Comment()
        comment1.author = 'Pat'
        comment1.text = 'Bones mend. Regret stays with you forever.'
        comment1.isVisible = true
        comment1.post = post
        const comment2 = new Comment()
        comment2.author = 'Jhon'
        comment2.text = 'To be alive is to be missing.'
        comment2.isVisible = false
        comment2.post = post2
        await connection.manager.save([comment1, comment2])
        const postWithComments = await connection.manager
          .createQueryBuilder()
          .select('post')
          .from(Post, 'post')
          .where(qb => {
            const subQuery = qb
              .subQuery()
              .select('postId')
              .from(Comment, 'comment')
              .getQuery()
            return 'post.id IN ' + subQuery
          })
          .getMany()
        expect(postWithComments.length).toEqual(1)
      })
    ))
})
