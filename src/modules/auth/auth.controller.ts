import { Request, Response, NextFunction } from "express";
import { UserRepository } from "../user/user.repository";
import { AuthService } from "./auth.service";

export class AuthController {
  private userRepo = new UserRepository();
  private authService = new AuthService(this.userRepo);

  login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { accessToken, refreshToken } = await this.authService.login(
        req.body?.email,
        req.body?.password,
      );

      res.status(200).json({ accessToken, refreshToken });
    } catch (error) {
      next(error);
    }
  };

  refresh = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { accessToken, refreshToken } = await this.authService.refresh(
        req.params.refreshToken as string,
      );

      res.status(200).json({ accessToken, refreshToken });
    } catch (error) {
      next(error);
    }
  };
}
