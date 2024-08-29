import { NextFunction, Request, Response } from 'express';
import { z } from 'zod';
import { fromError } from 'zod-validation-error';

export function customErrorHandler(
  error: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  if (error instanceof z.ZodError) {
    const validationError = fromError(error, { prefix: null });

    res.status(400).json({
      error_code: 'INVALID_DATA',
      error_description: validationError.toString(),
    });

    return;
  }

  console.log({ error });

  res.status(500).json({
    error_code: error.name,
    error_description: error.message || null,
  });
}
