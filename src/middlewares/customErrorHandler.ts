import { NextFunction, Request, Response } from 'express';

export function customErrorHandler(
  error: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  console.log({ error });

  return res.status(500).json({
    error_code: error.name,
    error_description: error.message || null,
  });
}
