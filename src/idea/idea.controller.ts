import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';

import { AuthGuard } from 'src/common/guards/auth.guard';
import { ValidationPipe } from 'src/common/pipes/validation.pipe';
import { User } from 'src/user/decorators/user.decorator';
import { CreateIdeaDto } from './dtos/create-idea.dto';
import { UpdateIdeaDto } from './dtos/update-idea.dto';
import { IdeaService } from './idea.service';

@Controller('api/idea')
export class IdeaController {
  private logger = new Logger('IdeaController');

  constructor(private ideaService: IdeaService) {}

  logData(options: any) {
    options.id && this.logger.log('ID ' + JSON.stringify(options.id));
    options.data && this.logger.log('DATA ' + JSON.stringify(options.data));
    options.user && this.logger.log('USER ' + JSON.stringify(options.user));
  }

  @Get()
  showAllIdeas() {
    return this.ideaService.showAll();
  }

  @Post()
  @UseGuards(AuthGuard)
  createIdea(
    @User('uuid') user: string,
    @Body(new ValidationPipe()) data: CreateIdeaDto,
  ) {
    this.logData({ user, data });
    return this.ideaService.create(user, data);
  }

  @Get('/:uuid')
  readIdea(@Param('uuid', ParseUUIDPipe) id: string) {
    return this.ideaService.read(id);
  }

  @Put('/:uuid')
  @UseGuards(AuthGuard)
  updateIdea(
    @Param('uuid', ParseUUIDPipe) id: string,
    @User('uuid') user: string,
    @Body(new ValidationPipe()) data: UpdateIdeaDto,
  ) {
    this.logData({ id, user, data });
    return this.ideaService.update(id, user, data);
  }

  @Delete('/:uuid')
  @UseGuards(AuthGuard)
  destroyIdea(
    @Param('uuid', ParseUUIDPipe) id: string,
    @User('uuid') user: string,
  ) {
    this.logData({ id, user });
    return this.ideaService.destroy(id, user);
  }
}
