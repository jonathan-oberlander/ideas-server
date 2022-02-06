import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { RequestWithUserToken } from 'src/common/types';
import { UserToken } from '../interfaces/user.interface';

export const User = createParamDecorator(
  (data: string, ctx: ExecutionContext): UserToken => {
    const { user } = ctx.switchToHttp().getRequest<RequestWithUserToken>();
    return data ? user?.[data] : user;
  },
);

// access jwt value if is passed to the decorator
