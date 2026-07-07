import { userInfo } from "node:os";
import {
  CustomError,
  generateAccessToken,
  generateRefreshToken,
} from "../../utils";
import { UserRepository } from "../user/user.repository";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export class AuthService {
  constructor(private userRepo: UserRepository) {}

  async login(
    email: string,
    password: string,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    if (!email) throw new CustomError("Email not found.", 400);
    if (!password) throw new CustomError("Password not found.", 400);

    const existingUser = await this.userRepo.findByEmail(email);
    if (!existingUser) throw new CustomError("User not found.", 400);

    const isValidUser = bcrypt.compareSync(password, existingUser.password);

    if (!isValidUser) throw new CustomError("Incorrect password.", 401);

    const accessToken = generateAccessToken(existingUser);
    const refreshToken = generateRefreshToken(existingUser.id);

    return { accessToken, refreshToken };
  }

  async refresh(
    refreshToken: string,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const payload = jwt.decode(refreshToken) as jwt.JwtPayload;

    const userID = payload.id || "";

    if (!userID) throw new CustomError("Unauthorized.", 401);

    const userInfo = await this.userRepo.findById(userID);

    if (!userInfo) throw new CustomError("User not found.", 400);

    const newAccessToken = generateAccessToken(userInfo);
    const newRefreshToken = generateRefreshToken(userInfo.id);

    return { accessToken: newAccessToken, refreshToken: newRefreshToken };
  }
}
