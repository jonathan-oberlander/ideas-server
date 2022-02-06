import { Body, Controller, Get, Post } from '@nestjs/common';
import { ValidationPipe } from 'src/common/pipes/validation.pipe';

import { UserDto } from './dtos/user.dto';
import { UserService } from './user.service';

@Controller()
export class UserController {
  constructor(private userService: UserService) {}

  @Get('api/users')
  showAllUsers() {
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
