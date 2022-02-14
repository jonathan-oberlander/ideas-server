import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Idea } from './idea.entity';
import { CreateIdeaDto } from './dtos/create-idea.dto';
import { User } from 'src/user/user.entity';
import { IdeaRO, UserRO } from 'src/common/types';
import { Votes } from 'src/common/types/votes.emun';

@Injectable()
export class IdeaService {
  constructor(
    @InjectRepository(Idea)
    private ideaRepository: Repository<Idea>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  /********* UTILS *********/

  private toResponseObject(idea: Idea): IdeaRO {
    return {
      ...idea,
      ...(idea?.upvotes && { upvotes: idea?.upvotes?.length }),
      ...(idea?.downvotes && { downvotes: idea?.downvotes?.length }),
      author: idea?.author?.toResponseObject(),
    };
  }

  private ensureOwnerShip(idea: Idea, userId: string) {
    if (idea?.author?.id !== userId) {
      throw new UnauthorizedException('Invalid User');
    }
  }

  /********* CRUD IDEA *********/

  async showAll(): Promise<IdeaRO[]> {
    const ideas = await this.ideaRepository.find({
      relations: ['author', 'upvotes', 'downvotes', 'comments'],
    });
    return ideas.map(this.toResponseObject);
  }

  async read(id: string): Promise<IdeaRO> {
    const idea = await this.ideaRepository.findOne({
      where: { id },
      relations: ['author', 'upvotes', 'downvotes', 'comments'],
    });

    if (!idea) {
      throw new NotFoundException();
    }

    return this.toResponseObject(idea);
  }

  async create(userId: string, data: CreateIdeaDto): Promise<IdeaRO> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    const idea = this.ideaRepository.create({ ...data, author: user });
    await this.ideaRepository.save(idea);
    return this.toResponseObject(idea);
  }

  async update(
    ideaId: string,
    userId: string,
    data: Partial<CreateIdeaDto>,
  ): Promise<IdeaRO> {
    const idea = await this.ideaRepository.findOne({
      where: { id: ideaId },
      relations: ['author'],
    });

    if (!idea) {
      throw new NotFoundException();
    }

    this.ensureOwnerShip(idea, userId);

    await this.ideaRepository.update({ id: ideaId }, data);
    return await this.read(ideaId);
  }

  async destroy(
    ideaId: string,
    userId: string,
  ): Promise<{
    deleted: IdeaRO;
  }> {
    const idea = await this.ideaRepository.findOne({
      where: { id: ideaId },
      relations: ['author'],
    });

    if (!idea) {
      throw new NotFoundException();
    }

    this.ensureOwnerShip(idea, userId);

    await this.ideaRepository.delete(ideaId);
    return { deleted: this.toResponseObject(idea) };
  }

  /********* BOOKMARK *********/

  async bookmark(ideaId: string, userId: string): Promise<UserRO> {
    const [user, idea] = await Promise.all([
      this.userRepository.findOne({
        where: { id: userId },
        relations: ['bookmarks'],
      }),
      this.ideaRepository.findOne({
        where: { id: ideaId },
      }),
    ]);

    if (!user || !idea) {
      throw new NotFoundException();
    }

    if (!user.bookmarks.some((bookmark) => bookmark.id === idea.id)) {
      user.bookmarks.push(idea);
      await this.userRepository.save(user);
    } else {
      throw new BadRequestException('Idea already in Bookmarks');
    }

    return user.toResponseObject();
  }

  async unBookmark(ideaId: string, userId: string): Promise<UserRO> {
    const [user, idea] = await Promise.all([
      this.userRepository.findOne({
        where: { id: userId },
        relations: ['bookmarks'],
      }),
      this.ideaRepository.findOne({
        where: { id: ideaId },
      }),
    ]);

    if (!user || !idea) {
      throw new NotFoundException();
    }

    if (user.bookmarks.some((bookmark) => bookmark.id === idea.id)) {
      user.bookmarks = user.bookmarks.filter(
        (bookmark) => bookmark.id !== idea.id,
      );
      await this.userRepository.save(user);
    } else {
      throw new BadRequestException('Idea is not bookmarked.');
    }

    return user.toResponseObject();
  }

  /********* VOTE *********/

  private async vote(ideaId: string, userId: string, vote: Votes) {
    const [idea, user] = await Promise.all([
      this.ideaRepository.findOne({
        where: { id: ideaId },
        relations: ['author', 'upvotes', 'downvotes'],
      }),
      this.userRepository.findOne({
        where: { id: userId },
      }),
    ]);

    if (!user || !idea) {
      throw new NotFoundException();
    }

    const oppositeVote = vote === Votes.UP ? Votes.DOWN : Votes.UP;
    const alreadyVoted = idea[vote].some((voter) => voter.id === user.id);
    const alreadyVotedOpposite = idea[oppositeVote].some(
      (voter) => voter.id === user.id,
    );

    if (alreadyVoted || alreadyVotedOpposite) {
      idea[oppositeVote] = idea[oppositeVote].filter(
        (voter) => voter.id !== user.id,
      );
      idea[vote] = idea[vote].filter((voter) => voter.id !== user.id);
      await this.ideaRepository.save(idea);
    } else if (!alreadyVoted) {
      idea[vote].push(user);
      await this.ideaRepository.save(idea);
    } else {
      throw new BadRequestException('Unable to cast vote.');
    }

    return this.toResponseObject(idea);
  }

  async upvote(ideaId: string, userId: string) {
    return await this.vote(ideaId, userId, Votes.UP);
  }

  async downvote(ideaId: string, userId: string) {
    return await this.vote(ideaId, userId, Votes.DOWN);
  }
}
