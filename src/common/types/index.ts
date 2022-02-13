import { Request } from 'express';
import { JwtPayload } from 'jsonwebtoken';
import { Idea } from 'src/idea/idea.entity';

export interface UserToken extends JwtPayload {
  username: string;
  id: string;
}

export type RequestWithUserToken = Request & {
  user: string | JwtPayload;
};

export interface IdeaRO {
  id: string;
  created: Date;
  updated: Date;
  idea: string;
  description: string;
  author: UserRO;
  upvotes?: number;
  downvotes?: number;
}

export interface UserRO {
  id: string;
  created: Date;
  username: string;
  token?: string;
  ideas?: Idea[];
  bookmarks?: Idea[];
}
