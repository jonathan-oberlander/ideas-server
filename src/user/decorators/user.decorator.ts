import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { RequestWithUserToken } from 'src/common/types';
export interface UserToken {
  username: string;
  uuid: string;
  iat: number;
  exp: number;
}

export const User = createParamDecorator(
  (data: string, ctx: ExecutionContext): UserToken => {
    const { user } = ctx.switchToHttp().getRequest<RequestWithUserToken>();
    return data ? user?.[data] : user;
  },
);

// access jwt value if is passed to the decorator
