import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from 'typeorm';

@Entity('idea')
export class Idea {
  @PrimaryGeneratedColumn('uuid')
  uuid: string;

  @CreateDateColumn()
  created: Date;

  @Column('text')
  idea: string;

  @Column('text')
  description: string;
}
