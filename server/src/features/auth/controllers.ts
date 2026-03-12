import { Request, Response, NextFunction } from "express";
import * as authService from "./services";
import { IApiResponse, IAuthTokens, IUserResponse } from "./interfaces";
import { AUTH_MESSAGES, COOKIE_OPTIONS } from "../../utils/constants";

export const register = async (
  req: Request,
  res: Response<IApiResponse<{ user: IUserResponse; tokens: IAuthTokens }>>,
  next: NextFunction
): Promise<void> => {
  try {
    const { user, tokens } = await authService.registerUser(req.body);

    res.cookie("refreshToken", tokens.refreshToken, COOKIE_OPTIONS);

    res.status(201).json({
      success: true,
      message: AUTH_MESSAGES.REGISTER_SUCCESS,
      data: { user, tokens },
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (
  req: Request,
  res: Response<IApiResponse<{ user: IUserResponse; tokens: IAuthTokens }>>,
  next: NextFunction
): Promise<void> => {
  try {
    const { user, tokens } = await authService.loginUser(req.body);

    res.cookie("refreshToken", tokens.refreshToken, COOKIE_OPTIONS);

    res.status(200).json({
      success: true,
      message: AUTH_MESSAGES.LOGIN_SUCCESS,
      data: { user, tokens },
    });
  } catch (error) {
    next(error);
  }
};

export const refreshToken = async (
  req: Request,
  res: Response<IApiResponse<IAuthTokens>>,
  next: NextFunction
): Promise<void> => {
  try {
    const token = req.cookies?.refreshToken || req.body.refreshToken;

    const tokens = await authService.refreshAccessToken(token);

    res.cookie("refreshToken", tokens.refreshToken, COOKIE_OPTIONS);

    res.status(200).json({
      success: true,
      message: AUTH_MESSAGES.TOKEN_REFRESHED,
      data: tokens,
    });
  } catch (error) {
    next(error);
  }
};

export const getProfile = async (
  req: Request,
  res: Response<IApiResponse<IUserResponse>>,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = (req as Request & { userId: string }).userId;
    const user = await authService.getUserProfile(userId);

    res.status(200).json({
      success: true,
      message: AUTH_MESSAGES.PROFILE_FETCHED,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

export const logout = async (
  _req: Request,
  res: Response<IApiResponse>,
  next: NextFunction
): Promise<void> => {
  try {
    res.clearCookie("refreshToken");

    res.status(200).json({
      success: true,
      message: AUTH_MESSAGES.LOGOUT_SUCCESS,
    });
  } catch (error) {
    next(error);
  }
};
