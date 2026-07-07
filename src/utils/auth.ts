import jwt from "jsonwebtoken";
import { IUser } from "../modules/user/user.model";
import dotenv from "dotenv";
import CustomError from "./error";

dotenv.config();

export const generateAccessToken = (userInfo: Partial<IUser>): string => {
  const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET as string;
  const accessTokenLife = process.env.ACCESS_TOKEN_LIFE as string;

  if (!accessTokenSecret)
    throw new CustomError("Access Token Secret not provided.", 500);

  if (!accessTokenLife)
    throw new CustomError("Access Token Life not provided.", 500);

  const payload = {
    id: userInfo.id,
    email: userInfo.email || "",
    firstname: userInfo.firstname || "",
    lastname: userInfo.lastname || "",
    type: "access",
    createdAt: userInfo.createdAt?.toISOString(),
    updatedAt: userInfo.updatedAt?.toISOString(),
  };

  const accessToken = jwt.sign(payload, accessTokenSecret, {
    expiresIn: accessTokenLife,
  } as jwt.SignOptions);

  return accessToken;
};

export const generateRefreshToken = (userID: string): string => {
  const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET as string;
  const refreshTokenLife = process.env.REFRESH_TOKEN_LIFE as string;

  if (!refreshTokenSecret)
    throw new CustomError("Refresh Token Secret not provided.", 500);

  if (!refreshTokenLife)
    throw new CustomError("Refresh Token Life not provided.", 500);

  const refreshToken = jwt.sign(
    { id: userID, type: "refresh" },
    refreshTokenSecret,
    { expiresIn: refreshTokenLife } as jwt.SignOptions,
  );

  return refreshToken;
};
