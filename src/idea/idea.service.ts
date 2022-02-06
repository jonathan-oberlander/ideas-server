import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Idea } from './idea.entity';
import { CreateIdeaDto } from './dtos/create-idea.dto';

@Injectable()
export class IdeaService {
  constructor(
    @InjectRepository(Idea)
    private ideaRepository: Repository<Idea>,
  ) {}

  async showAll(): Promise<Idea[]> {
    return await this.ideaRepository.find();
  }

  async create(createIdea: CreateIdeaDto): Promise<Idea> {
    const idea = this.ideaRepository.create(createIdea);
    await this.ideaRepository.save(idea);
    return idea;
  }

  async read(uuid: string): Promise<Idea> {
    const idea = await this.ideaRepository.findOne({ where: { uuid } });
    if (!idea) {
      throw new NotFoundException();
    }
    return idea;
  }

  async update(uuid: string, data: Partial<CreateIdeaDto>): Promise<Idea> {
    await this.ideaRepository.update({ uuid: uuid }, data);
    return await this.read(uuid);
  }

  async destroy(uuid: string): Promise<{
    deleted: Idea;
  }> {
    const idea = await this.read(uuid);
    await this.ideaRepository.delete(uuid);
    return { deleted: idea };
  }
}
