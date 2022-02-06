import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
} from '@nestjs/common';
import { CreateIdeaDto } from './dtos/create-idea.dto';
import { IdeaService } from './idea.service';

@Controller('idea')
export class IdeaController {
  constructor(private ideaService: IdeaService) {}

  @Get()
  showAllIdeas() {
    return this.ideaService.showAll();
  }

  @Post()
  createIdea(@Body() data: CreateIdeaDto) {
    return this.ideaService.create(data);
  }

  @Get('/:uuid')
  readIdea(@Param('uuid', ParseUUIDPipe) uuid: string) {
    return this.ideaService.read(uuid);
  }

  @Put('/:uuid')
  updateIdea(
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @Body() data: Partial<CreateIdeaDto>,
  ) {
    return this.ideaService.update(uuid, data);
  }

  @Delete('/:uuid')
  destroyIdea(@Param('uuid', ParseUUIDPipe) uuid: string) {
    return this.ideaService.destroy(uuid);
  }
}
