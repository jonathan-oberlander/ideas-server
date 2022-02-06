import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import * as jwt from 'jsonwebtoken';

import { RequestWithUserToken } from '../types';

@Injectable()
export class AuthGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<RequestWithUserToken>();
    if (!request.headers.authorization) {
      return false;
    }
    request.user = this.validateToken(request.headers.authorization);
    return true;
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
