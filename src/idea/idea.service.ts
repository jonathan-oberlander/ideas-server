import { Injectable } from '@nestjs/common';
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

  async showAll() {
    return await this.ideaRepository.find();
  }

  async create(createIdea: CreateIdeaDto) {
    const idea = this.ideaRepository.create(createIdea);
    await this.ideaRepository.save(idea);
    return idea;
  }

  async read(uuid: string) {
    return await this.ideaRepository.findOne({ where: { uuid } });
  }

  async update(uuid: string, data: Partial<CreateIdeaDto>) {
    await this.ideaRepository.update({ uuid: uuid }, data);
    return await this.read(uuid);
  }

  async destroy(uuid: string) {
    await this.ideaRepository.delete(uuid);
    return { deleted: true };
  }
}
