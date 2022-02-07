import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { UserRO } from 'src/common/types';
import { UserDto } from './dtos/user.dto';
import { User } from './user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async showAll(): Promise<UserRO[]> {
    const users = await this.userRepository.find({ relations: ['ideas'] });
    return users.map((user) => user.toResponseObject());
  }

  async login(data: UserDto): Promise<UserRO> {
    const { username, password } = data;
    const user = await this.userRepository.findOne({ where: { username } });
    if (!user || !(await user.matchPassword(password))) {
      throw new UnauthorizedException('Invalid username/password');
    }
    return user.toResponseObject({ showToken: true });
  }

  async register(data: UserDto): Promise<UserRO> {
    const { username } = data;
    let user = await this.userRepository.findOne({ where: { username } });
    if (user) {
      throw new ForbiddenException('User already exists');
    }
    user = this.userRepository.create(data);
    await this.userRepository.save(user);
    return user.toResponseObject({ showToken: true });
  }
}
