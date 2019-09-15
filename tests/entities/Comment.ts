import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { GlobalScopes } from "../../src/GlobalScopes";
import { Post } from "./Post";

@GlobalScopes([
  (qb, alias) =>
    qb.andWhere(`${alias}.isVisible=:isVisible`, { isVisible: true })
])
@Entity()
export class Comment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  author: string;

  @Column()
  text: string;

  @ManyToOne(type => Post, post => post.comments)
  post: Post;

  @Column()
  isVisible: boolean;
}
