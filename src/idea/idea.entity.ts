import { Comment } from 'src/comment/comment.entity';
import { User } from 'src/user/user.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  UpdateDateColumn,
  ManyToMany,
  JoinTable,
  OneToMany,
} from 'typeorm';

@Entity('idea')
export class Idea {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn()
  created: Date;

  @UpdateDateColumn()
  updated: Date;

  @Column('text')
  idea: string;

  @Column('text')
  description: string;

  @ManyToOne(() => User, (author) => author.ideas)
  author: User;

  /**
   *  cascade: when deleted the associated Type will also be deleted
   */

  @ManyToMany(() => User, { cascade: true })
  @JoinTable()
  upvotes: User[];

  @ManyToMany(() => User, { cascade: true })
  @JoinTable()
  downvotes: User[];

  @OneToMany(() => Comment, (comment) => comment.idea, { cascade: true })
  comments: Comment[];
}
