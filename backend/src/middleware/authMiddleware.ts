import type { Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
import { decodeAccessToken } from "../utils/generateTokens.js";
dotenv.config();

declare global {
  namespace Express {
    interface Request {
      userId?: string;
    }
  }
}
export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const accessToken = req.cookies.accessToken;
  console.log("🚀 ~ requireAuth ~ accessToken:", accessToken);

  if (!accessToken) {
    return res.status(401).json({
      message: "Missing token, please login", //TODO change to "Unauthorized"
    });
  }

  try {
    const decodedUserPayload = decodeAccessToken(`${accessToken}`);

    req.userId = decodedUserPayload?.userId;
    next();
  } catch (err: any) {
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({
        message: "Your session has expired, please login again",
      });
    }

    if (err.name === "JsonWebTokenError") {
      return res.status(401).json({
        message: "Your session has expired, please login again",
      });
    }

    return res.status(500).json({
      message: "Authentication error",
    });
  }
}
