import { Entity, PrimaryGeneratedColumn, Column, BeforeUpdate, OneToMany } from 'typeorm'
import { Comment } from './Comment'
import { GlobalScopes } from '../../src/GlobalScopes'

@GlobalScopes<Post>([
  (qb, alias) => qb.andWhere(`${alias}.author=:author`, { author: 'Carlos' })
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

  @OneToMany(type => Comment, comment => comment.post)
  comments: Comment[]

  @BeforeUpdate()
  beforeUpdate() {
    this.title = this.title.trim()
  }
}
