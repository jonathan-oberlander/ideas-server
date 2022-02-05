import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IdeaModule } from './idea/idea.module';
import { Idea } from './idea/idea.entity';
import configuration from './config/configuration';

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
      username: 'postgres',
      password: '',
      database: 'ideas',
      entities: [Idea],
      synchronize: true,
      logging: true,
    }),
    IdeaModule,
  ],
})
export class AppModule {}
