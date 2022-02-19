import { Args, Query, Resolver } from '@nestjs/graphql';
import { CommentService } from './comment.service';

@Resolver('Comment')
export class CommentResolver {
  constructor(private commentService: CommentService) {}

  @Query('comment')
  comment(@Args('commentId') commentId: string) {
    return this.commentService.showComment(commentId);
  }

  @Query('commentByIdea')
  commentByIdea(@Args('ideaId') ideaId: string) {
    return this.commentService.showCommentByIdea(ideaId);
  }

  @Query('commentByUser')
  commentByUser(@Args('userId') userId: string) {
    return this.commentService.showCommentByUser(userId);
  }
}
