import { NextFunction, Request, Response } from 'express';

export function upload(req: Request, res: Response, next: NextFunction) {
  try {
    res.status(200).json({ success: true });
  } catch (error) {
    next(error);
  }
}
