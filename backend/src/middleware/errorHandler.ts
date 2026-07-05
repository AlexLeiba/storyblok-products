import type { NextFunction, Request, Response } from "express";
import dotenv from "dotenv";

dotenv.config();
export class AppError extends Error {
  statusCode: number;
  isOperational: boolean;
  constructor(message: string, statusCode: number = 400) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

export function errorHandler(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) {
  let statusCode = err.statusCode || 500;
  let message = err.message || "Something went wrong";

  if (process.env.NODE_ENV === "development") {
    // CONSOLE ERRORS DURING DEVELOPMENT
    console.error("Error: ", err);
    console.error("Error stack: ", err.stack);
  } else {
    if (!err.isOperational) {
      console.error("Unexpected error: ", err?.message);
    }
  }
  if (err.name === "ValidationError") {
    message = Object.values(err.errors)
      .map((error: any) => error.message)
      .join(", ");
  }

  if (err.code === 11000) {
    //duplicate error of mongoose
    statusCode = 400;

    const field = Object.keys(err.keyValue)[0];
    message = `${field} already exists`;
  }

  if (err.name === "CastError") {
    message = `Invalid ${err.path}: ${err.value}`;
    statusCode = 400;
  }

  if (err.name === "JsonWebTokenError") {
    message = "Invalid token, please login again";
    statusCode = 401;
  }

  const response = {
    success: false,
    message,
    stack: undefined,
  };

  if (process.env.NODE_ENV === "development") {
    response.stack = err.stack;
  }
  res.status(statusCode).json(response);
}
