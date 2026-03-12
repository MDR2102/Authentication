import jwt from "jsonwebtoken";

import envConfig from "../../config/envConfig";
import { AUTH_MESSAGES } from "../../utils/constants";

import User, { IUserDocument } from "./models/User";
import { IAuthTokens, ITokenPayload, IUserResponse } from "./interfaces";

const generateTokens = (payload: ITokenPayload): IAuthTokens => {
  const accessToken = jwt.sign(payload, envConfig.JWT_ACCESS_SECRET, {
    expiresIn: envConfig.JWT_ACCESS_EXPIRY as jwt.SignOptions["expiresIn"],
  });

  const refreshToken = jwt.sign(payload, envConfig.JWT_REFRESH_SECRET, {
    expiresIn: envConfig.JWT_REFRESH_EXPIRY as jwt.SignOptions["expiresIn"],
  });

  return { accessToken, refreshToken };
};

const sanitizeUser = (user: IUserDocument): IUserResponse => ({
  _id: user._id as string,
  firstName: user.firstName,
  lastName: user.lastName,
  email: user.email,
  isVerified: user.isVerified,
  createdAt: user.createdAt as Date,
  updatedAt: user.updatedAt as Date,
});

export const registerUser = async (userData: {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}): Promise<{ user: IUserResponse; tokens: IAuthTokens }> => {
  const existingUser = await User.findOne({ email: userData.email });

  if (existingUser) {
    throw { statusCode: 409, message: AUTH_MESSAGES.EMAIL_ALREADY_EXISTS };
  }

  const user = await User.create(userData);

  const tokens = generateTokens({
    userId: user._id as string,
    email: user.email,
  });

  return { user: sanitizeUser(user), tokens };
};

export const loginUser = async (credentials: {
  email: string;
  password: string;
}): Promise<{ user: IUserResponse; tokens: IAuthTokens }> => {
  const user = await User.findOne({ email: credentials.email }).select(
    "+password"
  );

  if (!user) {
    throw { statusCode: 401, message: AUTH_MESSAGES.INVALID_CREDENTIALS };
  }

  const isPasswordValid = await user.comparePassword(credentials.password);

  if (!isPasswordValid) {
    throw { statusCode: 401, message: AUTH_MESSAGES.INVALID_CREDENTIALS };
  }

  const tokens = generateTokens({
    userId: user._id as string,
    email: user.email,
  });

  return { user: sanitizeUser(user), tokens };
};

export const refreshAccessToken = async (
  refreshToken: string
): Promise<IAuthTokens> => {
  if (!refreshToken) {
    throw { statusCode: 401, message: AUTH_MESSAGES.INVALID_REFRESH_TOKEN };
  }

  try {
    const decoded = jwt.verify(
      refreshToken,
      envConfig.JWT_REFRESH_SECRET
    ) as ITokenPayload;

    const user = await User.findById(decoded.userId);

    if (!user) {
      throw { statusCode: 401, message: AUTH_MESSAGES.USER_NOT_FOUND };
    }

    const tokens = generateTokens({
      userId: user._id as string,
      email: user.email,
    });

    return tokens;
  } catch (error) {
    if ((error as { statusCode?: number }).statusCode) {
      throw error;
    }
    throw { statusCode: 401, message: AUTH_MESSAGES.INVALID_REFRESH_TOKEN };
  }
};

export const getUserProfile = async (
  userId: string
): Promise<IUserResponse> => {
  const user = await User.findById(userId);

  if (!user) {
    throw { statusCode: 404, message: AUTH_MESSAGES.USER_NOT_FOUND };
  }

  return sanitizeUser(user);
};
