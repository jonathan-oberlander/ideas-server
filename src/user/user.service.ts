import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
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

  async showAll(page = 1): Promise<UserRO[]> {
    if (page - 1 < 0) {
      throw new BadRequestException(`Page must be >= 1`);
    }

    const users = await this.userRepository.find({
      take: 25,
      skip: 25 * (page - 1),
    });

    return users.map((user) => user.toResponseObject());
  }

  async show(id: string): Promise<UserRO> {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['ideas', 'bookmarks'],
    });

    if (!user) {
      throw new NotFoundException(`User ${id} not found`);
    }

    return user?.toResponseObject();
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
