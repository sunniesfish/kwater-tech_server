export interface TokenPayload {
  sub: string;
  username: string;
}

export interface Token {
  accessToken: string;
  refreshToken: string;
}
