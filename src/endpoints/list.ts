import { NextFunction, Request, Response } from 'express';
import { z } from 'zod';
import { requiredMeasureTypes } from '../config';

export function listEndpoint(
  req: Request<
    { customer_code: string },
    never,
    never,
    { measure_type: string }
  >,
  res: Response,
  next: NextFunction
) {
  try {
    const { customer_code } = req.params;
    const { measure_type } = req.query;

    const dataSchema = z.object({
      customerCode: z.string(),
      measure_type: z.enum(requiredMeasureTypes),
    });

    const data = dataSchema.parse({ customer_code, measure_type });

    res.status(200).json({
      success: true,
    });
  } catch (error) {
    next(error);
  }
}
