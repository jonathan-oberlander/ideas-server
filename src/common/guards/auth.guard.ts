import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { GqlContextType, GqlExecutionContext } from '@nestjs/graphql';
import * as jwt from 'jsonwebtoken';

import { RequestWithUserToken } from '../types';

@Injectable()
export class AuthGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const contextType = context.getType<GqlContextType>();

    // HTTP CONTEXT
    if (contextType === 'http') {
      const request = context.switchToHttp().getRequest<RequestWithUserToken>();

      if (!request.headers.authorization) {
        return false;
      }

      // ATTACH THE USER (JWT BODY) TO THE REQUEST OF THE HTTP CONTEXT
      // AND LIFT GUARD
      request.user = this.validateToken(request.headers.authorization);
      return true;
    }

    // GRAPHQL CONTEXT
    if (contextType === 'graphql') {
      const gqlCtx = GqlExecutionContext.create(context).getContext();

      const request = gqlCtx.req;
      if (!request.headers.authorization) {
        return false;
      }

      // ATTACH THE USER (JWT BODY) TO THE GQL CONTEXT
      // AND LIFT GUARD
      gqlCtx.user = this.validateToken(request.headers.authorization);
      return true;
    }
  }

  validateToken(auth: string) {
    const authParts = auth.split(' ');
    if (authParts[0] !== 'Bearer') {
      throw new ForbiddenException('Invalid Token');
    }

    const token = authParts[1];
    try {
      return jwt.verify(token, process.env.SECRET);
    } catch (error) {
      throw new ForbiddenException(
        `Token error: ${error.message} - ${error.name}`,
      );
    }
  }
}
