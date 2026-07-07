import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { apiReference } from "@scalar/express-api-reference";

import { errorMiddleware, validateApiToken } from "./middleware";
import { connectDB } from "./config";

// Router
import { authRouter, userRouter } from "./modules";
import { openApiDocs } from "./docs";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const STAGE = process.env.STAGE;
const excludedPaths = ["/api/health", "/api/docs"];

const allowedOrigins = ["http://localhost:3000"];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  }),
);
app.use(express.json());

app.use((req, res, next) => {
  if (excludedPaths.includes(req.path)) return next();
  validateApiToken(req, res, next);
});

// API Documentation route
app.use(
  "/api/docs",
  apiReference({
    spec: {
      content: openApiDocs,
    },
  }),
);

app.get("/api/health", (_req, res) => {
  res.status(200).json({
    status: "ok",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

app.use("/api", authRouter);
app.use("/api/users", userRouter);
app.use(errorMiddleware);

app.listen(PORT, () => {
  console.log(`[${STAGE}] server running on port ${PORT}`);
});

// Uncomment the following lines if you want to connect to the database before starting the server

// connectDB().then(() => {
//   app.listen(PORT, () => {
//     console.log(`[${STAGE}] server running on port ${PORT}`);
//   });
// });
