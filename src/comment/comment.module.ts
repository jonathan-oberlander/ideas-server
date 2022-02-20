import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Idea } from 'src/idea/idea.entity';
import { User } from 'src/user/user.entity';

import { CommentController } from './comment.controller';
import { Comment } from './comment.entity';
import { CommentResolver } from './comment.resolver';
import { CommentService } from './comment.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, Idea, Comment])],
  controllers: [CommentController],
  providers: [CommentService, CommentResolver],
})
export class CommentModule {}
