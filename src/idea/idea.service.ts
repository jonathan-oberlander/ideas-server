import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Idea } from './idea.entity';
import { CreateIdeaDto } from './dtos/create-idea.dto';
import { User } from 'src/user/user.entity';
import { IdeaRO } from 'src/common/types';

@Injectable()
export class IdeaService {
  constructor(
    @InjectRepository(Idea)
    private ideaRepository: Repository<Idea>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  private toResponseObject(idea: Idea): IdeaRO {
    return { ...idea, author: idea?.author?.toResponseObject() };
  }

  private ensureOwnerShip(idea: Idea, userId: string) {
    if (idea?.author?.uuid !== userId) {
      throw new UnauthorizedException('Invalid User');
    }
  }

  async showAll(): Promise<IdeaRO[]> {
    const ideas = await this.ideaRepository.find({ relations: ['author'] });
    return ideas.map(this.toResponseObject);
  }

  async create(userId: string, data: CreateIdeaDto): Promise<IdeaRO> {
    const user = await this.userRepository.findOne({ where: { uuid: userId } });
    const idea = this.ideaRepository.create({ ...data, author: user });
    await this.ideaRepository.save(idea);
    return this.toResponseObject(idea);
  }

  async read(uuid: string): Promise<IdeaRO> {
    const idea = await this.ideaRepository.findOne({
      where: { uuid },
      relations: ['author'],
    });

    if (!idea) {
      throw new NotFoundException();
    }

    return this.toResponseObject(idea);
  }

  async update(
    ideaId: string,
    userId: string,
    data: Partial<CreateIdeaDto>,
  ): Promise<IdeaRO> {
    const idea = await this.ideaRepository.findOne({
      where: { uuid: ideaId },
      relations: ['author'],
    });

    if (!idea) {
      throw new NotFoundException();
    }

    this.ensureOwnerShip(idea, userId);

    await this.ideaRepository.update({ uuid: ideaId }, data);
    return await this.read(ideaId);
  }

  async destroy(
    ideaId: string,
    userId: string,
  ): Promise<{
    deleted: IdeaRO;
  }> {
    const idea = await this.ideaRepository.findOne({
      where: { uuid: ideaId },
      relations: ['author'],
    });

    if (!idea) {
      throw new NotFoundException();
    }

    this.ensureOwnerShip(idea, userId);

    await this.ideaRepository.delete(ideaId);
    return { deleted: this.toResponseObject(idea) };
  }
}
