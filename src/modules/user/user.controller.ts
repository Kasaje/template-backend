import { Request, Response, NextFunction } from "express";
import { UserService } from "./user.service";

export class UserController {
  private userService = new UserService();

  getAll = async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const users = await this.userService.getAll();
      res.json({ status: "ok", items: users });
    } catch (error) {
      next(error);
    }
  };

  getById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = await this.userService.getById(req.params.id as string);
      res.json({ status: "ok", data: user });
    } catch (error) {
      next(error);
    }
  };

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await this.userService.create(req.body);
      res
        .status(201)
        .json({ status: "ok", message: "Create user successfully." });
    } catch (error) {
      next(error);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await this.userService.update(req.params.id as string, req.body);
      res.json({ status: "ok", message: "Update user successfully." });
    } catch (error) {
      next(error);
    }
  };

  delete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = req.params.id as string;
      await this.userService.delete(id);
      res.json({ status: "ok", message: "User deleted" });
    } catch (error) {
      next(error);
    }
  };
}
