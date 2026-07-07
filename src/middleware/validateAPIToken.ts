import { Request, Response, NextFunction } from "express";

const validateApiToken = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers["x-api-key"];

  if (!token) {
    return res.status(401).json({
      status: "error",
      message: "API token is required",
    });
  }

  if (token !== process.env.API_KEY) {
    return res.status(403).json({
      status: "error",
      message: "Invalid API token",
    });
  }

  next();
};

export default validateApiToken;
