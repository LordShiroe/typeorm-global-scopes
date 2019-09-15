import { Post } from "./entities/Post";
import { Connection, Equal } from "typeorm";
import {
  createTestingConnections,
  closeTestingConnections
} from "./util/testUtils";
import { patchSelectQueryBuilder } from "../src/patch-select-query-builder";
import { PostRepository } from "./repositories/PostRepository";
import { getPosts } from "./util/getPosts";

describe("query using repository", () => {
  patchSelectQueryBuilder();
  let connections: Connection[];
  beforeAll(
    async () =>
      (connections = await createTestingConnections({
        entities: [__dirname + "/entities/*{.js,.ts}"],
        schemaCreate: true,
        dropSchema: true
      }))
  );
  afterAll(() => closeTestingConnections(connections));
  beforeEach(() => {
    return Promise.all(
      connections.map(async connection => {
        await connection.manager.query("SET FOREIGN_KEY_CHECKS=0");
        await connection.manager.getRepository(Post).clear();
        await connection.manager.query("SET FOREIGN_KEY_CHECKS=1");
      })
    );
  });

  it("adds the global scope to normal repository", () =>
    Promise.all(
      connections.map(async connection => {
        await connection.getRepository(Post).save(getPosts());
        const post = await connection.getRepository(Post).find({
          where: { title: Equal("The title") }
        });
        expect(post.length).toEqual(1);
        expect(post[0].author).toEqual("Carlos");
      })
    ));

  it("adds the global scope to custom repository", () =>
    Promise.all(
      connections.map(async connection => {
        await connection.getCustomRepository(PostRepository).save(getPosts());
        const post = await connection.getCustomRepository(PostRepository).find({
          where: { title: Equal("The title") }
        });
        expect(post.length).toEqual(1);
        expect(post[0].author).toEqual("Carlos");
      })
    ));
});
