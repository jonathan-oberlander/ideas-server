import { UseGuards } from '@nestjs/common';
import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { UserToken } from 'src/common/types';
import { CommentService } from './comment.service';

@Resolver('Comment')
export class CommentResolver {
  constructor(private commentService: CommentService) {}

  @Query()
  comment(@Args('commentId') commentId: string) {
    return this.commentService.showComment(commentId);
  }

  @Mutation()
  @UseGuards(new AuthGuard())
  createComment(
    @Args('ideaId') ideaId: string,
    @Args('comment') comment: string,
    @Context('user') user: UserToken,
  ) {
    return this.commentService.createComment(ideaId, user.id, { comment });
  }

  @Mutation()
  @UseGuards(new AuthGuard())
  deleteComment(
    @Args('commentId') commentId: string,
    @Context('user') user: UserToken,
  ) {
    return this.commentService.destroy(commentId, user.id);
  }
}
