export interface UserRO {
  uuid: string;
  created: Date;
  username: string;
  token?: string;
}

export interface UserToken {
  username: string;
  uuid: string;
  iat: number;
  exp: number;
}
