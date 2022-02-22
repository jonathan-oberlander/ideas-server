import { UseGuards } from '@nestjs/common';
import {
  Resolver,
  Query,
  Args,
  ResolveProperty,
  Parent,
  Mutation,
  Context,
} from '@nestjs/graphql';
import { CommentService } from 'src/comment/comment.service';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { Idea } from './idea.entity';
import { IdeaService } from './idea.service';
import { UserToken } from 'src/common/types';

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

  @Mutation()
  @UseGuards(AuthGuard)
  createIdea(
    @Args('idea') idea: string,
    @Args('description') description: string,
    @Context('user') user: UserToken,
  ) {
    return this.ideaService.create(user.id, { idea, description });
  }

  @Mutation()
  @UseGuards(AuthGuard)
  updateIdea(
    @Args('ideaId') ideaId: string,
    @Args('idea') idea: string,
    @Args('description') description: string,
    @Context('user') user: UserToken,
  ) {
    return this.ideaService.update(ideaId, user.id, { idea, description });
  }

  @Mutation()
  @UseGuards(AuthGuard)
  deleteIdea(@Args('ideaId') ideaId: string, @Context('user') user: UserToken) {
    return this.ideaService.destroy(ideaId, user.id);
  }

  @Mutation()
  @UseGuards(AuthGuard)
  bookmark(@Args('ideaId') ideaId: string, @Context('user') user: UserToken) {
    return this.ideaService.bookmark(ideaId, user.id);
  }

  @Mutation()
  @UseGuards(AuthGuard)
  unBookmark(@Args('ideaId') ideaId: string, @Context('user') user: UserToken) {
    return this.ideaService.unBookmark(ideaId, user.id);
  }

  @Mutation()
  @UseGuards(AuthGuard)
  upvote(@Args('ideaId') ideaId: string, @Context('user') user: UserToken) {
    return this.ideaService.upvote(ideaId, user.id);
  }

  @Mutation()
  @UseGuards(AuthGuard)
  downvote(@Args('ideaId') ideaId: string, @Context('user') user: UserToken) {
    return this.ideaService.downvote(ideaId, user.id);
  }
}
