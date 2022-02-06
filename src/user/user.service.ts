import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserDto } from './dtos/user.dto';
import { UserRO } from './interfaces/user.interface';
import { User } from './user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRpository: Repository<User>,
  ) {}

  async showAll(): Promise<UserRO[]> {
    const users = await this.userRpository.find();
    return users.map((user) => user.toResponseObject());
  }

  async login(data: UserDto): Promise<UserRO> {
    const { username, password } = data;
    const user = await this.userRpository.findOne({ where: { username } });
    const match = await user.matchPassword(password);
    if (!user || !match) {
      throw new UnauthorizedException('Invalid username/password');
    }
    return user.toResponseObject({ showToken: true });
  }

  async register(data: UserDto): Promise<UserRO> {
    const { username } = data;
    let user = await this.userRpository.findOne({ where: { username } });
    if (user) {
      throw new ForbiddenException('User already exists');
    }
    user = this.userRpository.create(data);
    await this.userRpository.save(user);
    return user.toResponseObject({ showToken: true });
  }
}
