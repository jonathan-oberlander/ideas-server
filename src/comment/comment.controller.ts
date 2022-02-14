import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { User } from 'src/user/decorators/user.decorator';
import { CommentService } from './comment.service';
import { CreateCommentDTO } from './dto/create-comment.dto';

@Controller('api/comment')
export class CommentController {
  constructor(private commentService: CommentService) {}

  @Get('/:id')
  showComment(@Param('id') commentId: string) {
    return this.commentService.showComment(commentId);
  }

  @Get('/user/:id')
  showCommentsByUser(@Param('id') userId: string) {
    return this.commentService.showCommentByUser(userId);
  }

  @Get('/idea/:id')
  showCommentsByIdea(@Param('id') ideaId: string) {
    return this.commentService.showCommentByIdea(ideaId);
  }

  @Post('/idea/:id')
  @UseGuards(AuthGuard)
  createComment(
    @Param('id') ideaId: string,
    @User('id') userId: string,
    @Body(new ValidationPipe()) data: CreateCommentDTO,
  ) {
    return this.commentService.createComment(ideaId, userId, data);
  }

  @Delete('/:id')
  @UseGuards(AuthGuard)
  destroyComment(@Param('id') commentId: string, @User('id') userId: string) {
    return this.commentService.destroy(commentId, userId);
  }
}
