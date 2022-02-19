import {
  Resolver,
  Query,
  Args,
  ResolveProperty,
  Parent,
} from '@nestjs/graphql';
import { CommentService } from 'src/comment/comment.service';
import { Idea } from './idea.entity';
import { IdeaService } from './idea.service';

@Resolver('Idea')
export class IdeaResolver {
  constructor(
    private ideaService: IdeaService,
    private commentService: CommentService,
  ) {}

  @Query()
  ideas(@Args('page') page: number, @Args('newest') newest: boolean) {
    return this.ideaService.showAll(page, newest);
  }

  @ResolveProperty()
  comments(@Parent() idea: Idea) {
    const { id } = idea;
    return this.commentService.showCommentByIdea(id);
  }
}
