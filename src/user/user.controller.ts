import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { ValidationPipe } from 'src/common/pipes/validation.pipe';
import { User } from './decorators/user.decorator';

import { UserDto } from './dtos/user.dto';
import { UserToken } from './interfaces/user.interface';
import { UserService } from './user.service';

@Controller()
export class UserController {
  constructor(private userService: UserService) {}

  @Get('api/users')
  @UseGuards(new AuthGuard())
  showAllUsers(@User() user: UserToken) {
    console.log(user);
    return this.userService.showAll();
  }

  @Post('login')
  login(@Body(new ValidationPipe()) data: UserDto) {
    return this.userService.login(data);
  }

  @Post('register')
  register(@Body(new ValidationPipe()) data: UserDto) {
    return this.userService.register(data);
  }
}
