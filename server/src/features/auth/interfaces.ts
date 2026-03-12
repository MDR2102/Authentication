export interface IUser {
  _id?: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  isVerified: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IUserResponse {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ITokenPayload {
  userId: string;
  email: string;
}

export interface IAuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface IApiResponse<T = undefined> {
  success: boolean;
  message: string;
  data?: T;
  code?: string;
}
