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
  Query,
  UseGuards,
} from '@nestjs/common';

import { AuthGuard } from 'src/common/guards/auth.guard';
import { ValidationPipe } from 'src/common/pipes/validation.pipe';
import { User } from 'src/user/decorators/user.decorator';
import { CreateIdeaDto } from './dtos/create-idea.dto';
import { UpdateIdeaDto } from './dtos/update-idea.dto';
import { IdeaService } from './idea.service';

@Controller('api/ideas')
export class IdeaController {
  private logger = new Logger('IdeaController');

  constructor(private ideaService: IdeaService) {}

  logData(options: any) {
    options.ideaId &&
      this.logger.log('IDEA_ID:' + JSON.stringify(options.ideaId));
    options.userId &&
      this.logger.log('USER_ID:' + JSON.stringify(options.userId));
    options.data && this.logger.log('DATA:' + JSON.stringify(options.data));
  }

  @Get()
  showAllIdeas(@Query('page') page: number) {
    return this.ideaService.showAll(page);
  }

  @Get('newest')
  showNewest(@Query('page') page: number) {
    return this.ideaService.showAll(page, true);
  }

  @Post()
  @UseGuards(AuthGuard)
  createIdea(
    @User('id', ParseUUIDPipe) userId: string,
    @Body(new ValidationPipe()) data: CreateIdeaDto,
  ) {
    this.logData({ userId, data });
    return this.ideaService.create(userId, data);
  }

  @Get('/:id')
  readIdea(@Param('id', ParseUUIDPipe) ideaId: string) {
    return this.ideaService.read(ideaId);
  }

  @Put('/:id')
  @UseGuards(AuthGuard)
  updateIdea(
    @Param('id', ParseUUIDPipe) ideaId: string,
    @User('id', ParseUUIDPipe) userId: string,
    @Body(new ValidationPipe()) data: UpdateIdeaDto,
  ) {
    this.logData({ ideaId, userId, data });
    return this.ideaService.update(ideaId, userId, data);
  }

  @Delete('/:id')
  @UseGuards(AuthGuard)
  destroyIdea(
    @Param('id', ParseUUIDPipe) ideaId: string,
    @User('id', ParseUUIDPipe) userId: string,
  ) {
    this.logData({ ideaId, userId });
    return this.ideaService.destroy(ideaId, userId);
  }

  @Post('/:id/bookmark')
  @UseGuards(AuthGuard)
  bookmarkIdea(
    @Param('id', ParseUUIDPipe) ideaId: string,
    @User('id', ParseUUIDPipe) userId: string,
  ) {
    this.logData({ ideaId, userId });
    return this.ideaService.bookmark(ideaId, userId);
  }

  @Delete('/:id/bookmark')
  @UseGuards(AuthGuard)
  unbookmarkIdea(
    @Param('id', ParseUUIDPipe) ideaId: string,
    @User('id', ParseUUIDPipe) userId: string,
  ) {
    this.logData({ ideaId, userId });
    return this.ideaService.unBookmark(ideaId, userId);
  }

  @Post('/:id/upvote')
  @UseGuards(AuthGuard)
  upvote(
    @Param('id', ParseUUIDPipe) ideaId: string,
    @User('id', ParseUUIDPipe) userId: string,
  ) {
    this.logData({ ideaId, userId });
    return this.ideaService.upvote(ideaId, userId);
  }

  @Post('/:id/downvote')
  @UseGuards(AuthGuard)
  downvote(
    @Param('id', ParseUUIDPipe) ideaId: string,
    @User('id', ParseUUIDPipe) userId: string,
  ) {
    this.logData({ ideaId, userId });
    return this.ideaService.downvote(ideaId, userId);
  }
}
