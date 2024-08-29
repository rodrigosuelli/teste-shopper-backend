import { NextFunction, Request, Response } from 'express';

export function confirmEndpoint(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    console.log('hi');
  } catch (error) {
    next(error);
  }
}
