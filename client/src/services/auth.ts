import apiClient from "./apiClient";
import { API_ENDPOINTS } from "../constants";
import {
  IApiResponse,
  IAuthTokens,
  ILoginPayload,
  IRegisterPayload,
  IUser,
} from "../interfaces/auth.interface";

export const authService = {
  register: async (
    payload: IRegisterPayload
  ): Promise<IApiResponse<{ user: IUser; tokens: IAuthTokens }>> => {
    const { data } = await apiClient.post(API_ENDPOINTS.AUTH.REGISTER, payload);
    return data;
  },

  login: async (
    payload: ILoginPayload
  ): Promise<IApiResponse<{ user: IUser; tokens: IAuthTokens }>> => {
    const { data } = await apiClient.post(API_ENDPOINTS.AUTH.LOGIN, payload);
    return data;
  },

  logout: async (): Promise<IApiResponse> => {
    const { data } = await apiClient.post(API_ENDPOINTS.AUTH.LOGOUT);
    return data;
  },

  getProfile: async (): Promise<IApiResponse<IUser>> => {
    const { data } = await apiClient.get(API_ENDPOINTS.AUTH.PROFILE);
    return data;
  },

  refreshToken: async (): Promise<IApiResponse<IAuthTokens>> => {
    const { data } = await apiClient.post(API_ENDPOINTS.AUTH.REFRESH_TOKEN);
    return data;
  },
};
