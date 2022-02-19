import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Comment } from 'src/comment/comment.entity';
import { CommentService } from 'src/comment/comment.service';

import { User } from 'src/user/user.entity';

import { Idea } from './idea.entity';
import { IdeaController } from './idea.controller';
import { IdeaResolver } from './idea.resolver';
import { IdeaService } from './idea.service';

@Module({
  imports: [TypeOrmModule.forFeature([Idea, User, Comment])],
  controllers: [IdeaController],
  providers: [IdeaService, IdeaResolver, CommentService],
  exports: [TypeOrmModule],
})
export class IdeaModule {}
