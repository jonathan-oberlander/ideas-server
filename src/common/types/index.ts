import { Request } from 'express';
import { JwtPayload } from 'jsonwebtoken';
import { Idea } from 'src/idea/idea.entity';

export interface UserToken extends JwtPayload {
  username: string;
  uuid: string;
}

export type RequestWithUserToken = Request & {
  user: string | JwtPayload;
};

export interface IdeaRO {
  author: UserRO;
  uuid: string;
  created: Date;
  updated: Date;
  idea: string;
  description: string;
}

export interface UserRO {
  uuid: string;
  created: Date;
  username: string;
  token?: string;
  ideas?: Idea[];
}
