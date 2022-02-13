import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';

import { Idea } from 'src/idea/idea.entity';
import { UserRO } from 'src/common/types';

@Entity('user')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn()
  created: Date;

  @Column({
    type: 'text',
    unique: true,
  })
  username: string;

  @Column('text')
  password: string;

  @OneToMany(() => Idea, (idea) => idea.author)
  ideas: Idea[];

  @ManyToMany(() => Idea, { cascade: true })
  @JoinTable()
  bookmarks: Idea[];

  @BeforeInsert()
  private async hashPassword() {
    this.password = await bcrypt.hash(this.password, 10);
  }

  toResponseObject({ showToken } = { showToken: false }): UserRO {
    const { id, created, username, token } = this;
    return {
      id,
      created,
      username,
      ...(showToken && { token }),
      ...(this.ideas && { ideas: this.ideas }),
      ...(this.bookmarks && { bookmarks: this.bookmarks }),
    };
  }

  async matchPassword(attempt: string) {
    return await bcrypt.compare(attempt, this.password);
  }

  private get token() {
    const { username, id } = this;
    return jwt.sign(
      {
        username,
        id,
      },
      process.env.SECRET,
      { expiresIn: '2d' },
    );
  }
}
