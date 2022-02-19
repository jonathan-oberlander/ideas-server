import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserController } from './user.controller';
import { User } from './user.entity';
import { UserService } from './user.service';
import { UserResolver } from './user.resolver';

import { Comment } from 'src/comment/comment.entity';
import { CommentService } from 'src/comment/comment.service';

import { Idea } from 'src/idea/idea.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Idea, Comment])],
  controllers: [UserController],
  providers: [UserService, UserResolver, CommentService],
})
export class UserModule {}
