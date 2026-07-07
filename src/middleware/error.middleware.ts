import { Request, Response, NextFunction } from "express";
import { CustomError } from "../utils";

const errorMiddleware = (
  error: Error | CustomError,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  console.error(error.message);

  if (error instanceof CustomError) {
    return res.status(error.statusCode).json({
      status: "error",
      message: error.message,
    });
  }
  res.status(500).json({ status: "error", message: error.message });
};

export default errorMiddleware;
