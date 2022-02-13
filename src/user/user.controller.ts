import { Body, Controller, Get, Param, Post } from '@nestjs/common';
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

  @Get('api/users/:id')
  showUser(@Param('id') id: string) {
    return this.userService.show(id);
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
