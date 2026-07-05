import type { NextFunction, Request, RequestHandler, Response } from "express";
import type { ApiResponse } from "../types";

export function sendSuccess<T>(
  res: Response,
  data: T,
  message: string,
  statusCode: number = 200,
) {
  const response: ApiResponse<T> = {
    success: true,
    data,
    message,
  };

  res.status(statusCode).json(response);
}

export function sendError(
  res: Response,
  message: string,
  statusCode: number = 400,
) {
  const response: ApiResponse<null> = {
    success: false,
    message,
  };
  res.status(statusCode).json(response);
}

// an utility which will help to avoiding using try catch block on every route listener
// use this middleware on every route to caught thrown errors by the wrapped route listener
export function asyncHandler(fn: RequestHandler) {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next); //send error to error handler, handles the callback async
  };
}
