import { Resolver, Query, Args, ResolveField, Parent } from '@nestjs/graphql';
import { CommentService } from 'src/comment/comment.service';
import { User } from './user.entity';
import { UserService } from './user.service';

@Resolver('User')
export class UserResolver {
  constructor(
    private userService: UserService,
    private commentService: CommentService,
  ) {}

  @Query()
  users(@Args('page') page: number) {
    return this.userService.showAll(page);
  }

  @ResolveField()
  comments(@Parent() user: User) {
    const { id } = user;
    return this.commentService.showCommentByUser(id);
  }
}
