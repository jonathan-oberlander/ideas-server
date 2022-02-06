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
} from '@nestjs/common';
import { ValidationPipe } from 'src/common/pipes/validation.pipe';
import { CreateIdeaDto } from './dtos/create-idea.dto';
import { UpdateIdeaDto } from './dtos/update-idea.dto';
import { IdeaService } from './idea.service';

@Controller('idea')
export class IdeaController {
  private logger = new Logger('IdeaController');

  constructor(private ideaService: IdeaService) {}

  @Get()
  showAllIdeas() {
    return this.ideaService.showAll();
  }

  @Post()
  createIdea(@Body(new ValidationPipe()) data: CreateIdeaDto) {
    this.logger.log(JSON.stringify(data));
    return this.ideaService.create(data);
  }

  @Get('/:uuid')
  readIdea(@Param('uuid', ParseUUIDPipe) uuid: string) {
    return this.ideaService.read(uuid);
  }

  @Put('/:uuid')
  updateIdea(
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @Body(new ValidationPipe()) data: UpdateIdeaDto,
  ) {
    this.logger.log(JSON.stringify(data));
    return this.ideaService.update(uuid, data);
  }

  @Delete('/:uuid')
  destroyIdea(@Param('uuid', ParseUUIDPipe) uuid: string) {
    return this.ideaService.destroy(uuid);
  }
}
