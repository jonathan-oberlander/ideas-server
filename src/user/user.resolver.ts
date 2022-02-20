import { UseGuards } from '@nestjs/common';
import {
  Resolver,
  Query,
  Args,
  ResolveField,
  Parent,
  Mutation,
  Context,
} from '@nestjs/graphql';
import { CommentService } from 'src/comment/comment.service';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { UserToken } from 'src/common/types';
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

  @Query()
  user(@Args('username') username: string) {
    return this.userService.showByName(username);
  }

  @Query()
  @UseGuards(new AuthGuard())
  whoami(@Context('user') user: UserToken) {
    return this.userService.showByName(user.username);
  }

  @Mutation()
  login(
    @Args('username') username: string,
    @Args('password') password: string,
  ) {
    return this.userService.login({ username, password });
  }

  @Mutation()
  register(
    @Args('username') username: string,
    @Args('password') password: string,
  ) {
    return this.userService.register({ username, password });
  }

  @ResolveField()
  comments(@Parent() user: User) {
    const { id } = user;
    return this.commentService.showCommentByUser(id);
  }
}
