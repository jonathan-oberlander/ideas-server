import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CommentRO } from 'src/common/types';
import { Idea } from 'src/idea/idea.entity';
import { User } from 'src/user/user.entity';
import { Repository } from 'typeorm';
import { Comment } from './comment.entity';
import { CreateCommentDTO } from './dto/create-comment.dto';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment)
    private commentRepository: Repository<Comment>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Idea)
    private ideaRepository: Repository<Idea>,
  ) {}

  toResponseObject(comment: Comment): CommentRO {
    const responseObject = comment as unknown as CommentRO;
    if (comment?.author) {
      responseObject.author = comment.author.toResponseObject();
    }

    return responseObject;
  }

  /******************************* CRUD *******************************/

  async showComment(commentId: string): Promise<CommentRO> {
    console.log({ commentId });
    const comment = await this.commentRepository.findOne({
      where: { id: commentId },
      relations: ['author', 'idea'],
    });

    return this.toResponseObject(comment);
  }

  // TOW WAYS ACCESSING THE DATA
  // 1. Via the current entity
  async showCommentByUser(userId: string, page = 1): Promise<CommentRO[]> {
    if (page - 1 < 0) {
      throw new BadRequestException(`Page must be >= 1`);
    }

    const comments = await this.commentRepository.find({
      where: { author: { id: userId } },
      relations: ['author', 'idea'],
      take: 25,
      skip: 25 * (page - 1),
    });

    return comments.map((comment) => this.toResponseObject(comment));
  }

  async showCommentByIdea(ideaId: string, page = 1): Promise<CommentRO[]> {
    if (page - 1 < 0) {
      throw new BadRequestException(`Page must be >= 1`);
    }

    const comments = await this.commentRepository.find({
      where: { idea: { id: ideaId } },
      relations: ['author', 'idea'],
      take: 25,
      skip: 25 * (page - 1),
    });

    return comments.map((comment) => this.toResponseObject(comment));
  }

  // 2. Via the related entity
  // const idea = await this.ideaRepository.findOne({
  //   where: { id: ideaId },
  //   relations: ['comments', 'comments.author', 'comments.idea'],
  // });

  // return idea.comments.map((comment) => this.toResponseObject(comment));

  async createComment(
    ideaId: string,
    userId: string,
    data: CreateCommentDTO,
  ): Promise<CommentRO> {
    const [idea, author] = await Promise.all([
      this.ideaRepository.findOne({ where: { id: ideaId } }),
      this.userRepository.findOne({ where: { id: userId } }),
    ]);

    if (!idea || !author) {
      throw new NotFoundException();
    }

    const comment = this.commentRepository.create({
      ...data,
      author,
      idea,
    });

    await this.commentRepository.save(comment);

    return this.toResponseObject(comment);
  }

  async destroy(commentId: string, userId: string): Promise<CommentRO> {
    const comment = await this.commentRepository.findOne({
      where: { id: commentId },
      relations: ['author', 'idea'],
    });

    if (!comment) {
      throw new NotFoundException(`Comment: ${commentId} not found.`);
    }

    if (comment.author.id !== userId) {
      throw new BadRequestException('You do not own this comment.');
    }

    await this.commentRepository.remove(comment);

    return this.toResponseObject(comment);
  }
}
