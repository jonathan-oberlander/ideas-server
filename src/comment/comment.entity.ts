import { Idea } from 'src/idea/idea.entity';
import { User } from 'src/user/user.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  UpdateDateColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

@Entity('comment')
export class Comment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn()
  created: Date;

  @UpdateDateColumn()
  updated: Date;

  @Column('text')
  comment: string;

  @ManyToOne(() => User)
  @JoinColumn()
  author: User;

  @ManyToOne(() => Idea, (idea) => idea.comments)
  idea: Idea;
}
