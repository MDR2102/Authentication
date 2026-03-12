export interface IUser {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface IAuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface IApiResponse<T = undefined> {
  success: boolean;
  message: string;
  data?: T;
}

export interface ILoginPayload {
  email: string;
  password: string;
}

export interface IRegisterPayload {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface IAuthState {
  user: IUser | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}
