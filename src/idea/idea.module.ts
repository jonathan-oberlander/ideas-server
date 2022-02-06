import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/user.entity';

import { IdeaController } from './idea.controller';
import { Idea } from './idea.entity';
import { IdeaService } from './idea.service';

@Module({
  imports: [TypeOrmModule.forFeature([Idea, User])],
  providers: [IdeaService],
  controllers: [IdeaController],
  exports: [TypeOrmModule],
})
export class IdeaModule {}
