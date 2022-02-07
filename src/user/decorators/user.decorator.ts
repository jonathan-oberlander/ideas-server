import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { RequestWithUserToken, UserToken } from 'src/common/types';

export const User = createParamDecorator(
  (data: string, ctx: ExecutionContext): UserToken => {
    const { user } = ctx.switchToHttp().getRequest<RequestWithUserToken>();
    // access jwt value passed to the decorator
    return data ? user?.[data] : user;
  },
);
