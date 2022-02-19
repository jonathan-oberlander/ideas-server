import { Module } from '@nestjs/common';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { IdeaModule } from './idea/idea.module';
import { Idea } from './idea/idea.entity';
import configuration from './config/configuration';

import { HttpExceptionFilter } from './common/filters/http-exeption.filter';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';
import { UserModule } from './user/user.module';
import { User } from './user/user.entity';
import { CommentModule } from './comment/comment.module';
import { Comment } from './comment/comment.entity';

const {
  database: { port, host },
} = configuration();

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host,
      port,
      dropSchema: false,
      username: 'postgres',
      password: '',
      database: 'ideas',
      entities: [Idea, User, Comment],
      synchronize: true,
      logging: true,
    }),
    IdeaModule,
    UserModule,
    CommentModule,
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
  ],
})
export class AppModule {}
