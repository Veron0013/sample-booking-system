export type DataToken = {
  access_token: string;
  refresh_token: string;
};

export type DataCredentials = {
  email: string;
  password: string;
};

export type JwtPayload = {
  sub: string; // userId
  email: string;
  type: 'USER' | 'ADMIN'; // або enum
};
