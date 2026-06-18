import type { NextFunction, Request, Response } from "express";

export function errorMiddleware(
  error: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
) {
  res.status(400).json({
    error: error.message,
  });
}
