import { NextFunction, Request, Response } from 'express';
import { z } from 'zod';
import { fromError } from 'zod-validation-error';
import { promptWithBase64Image } from '../services/geminiApi';

export async function upload(req: Request, res: Response, next: NextFunction) {
  try {
    const uploadEndpointSchema = z.object({
      image: z.string().base64(),
      customer_code: z.string(),
      measure_datetime: z.string().datetime(),
      measure_type: z.enum(['WATER', 'GAS']),
    });

    const data = uploadEndpointSchema.parse(req.body);

    const { image: imageBase64String } = data;

    const result = await promptWithBase64Image(
      'image/png',
      imageBase64String,
      'Describe the image'
    );

    res.status(200).json({ success: true, ...data });
  } catch (error) {
    if (error instanceof z.ZodError) {
      const validationError = fromError(error, { prefix: null });

      res.status(400).json({
        error_code: 'INVALID_DATA',
        error_description: validationError.toString(),
      });

      return;
    }

    next(error);
  }
}
