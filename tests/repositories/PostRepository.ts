import { EntityRepository, Repository } from "typeorm";
import { Post } from "../entities/Post";

@EntityRepository(Post)
export class PostRepository extends Repository<Post> {
  findByTitle(title: string) {
    return this.find({ where: { title } });
  }
}
