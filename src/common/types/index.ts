import { Request } from 'express';
import { JwtPayload } from 'jsonwebtoken';

export type RequestWithUserToken = Request & {
  user: string | JwtPayload;
};
