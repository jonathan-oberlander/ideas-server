import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { RequestWithUserToken, UserToken } from 'src/common/types';

export const User = createParamDecorator(
  // data is the key I want to access from the JWT body
  (data: string, ctx: ExecutionContext): UserToken => {
    const { user } = ctx.switchToHttp().getRequest<RequestWithUserToken>();
    // access jwt value passed to the decorator
    return data ? user?.[data] : user;
  },
);
