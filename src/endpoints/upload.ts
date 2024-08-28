import { NextFunction, Request, Response } from 'express';
import { z } from 'zod';
import { fromError } from 'zod-validation-error';
import { promptWithBase64Image } from '../services/geminiApi';
import parseDataURI from '../utils/parseDataURI';

export async function upload(req: Request, res: Response, next: NextFunction) {
  try {
    // Regular expression to match image Data URI
    const imageDataUriRegex =
      /^data:image\/(png|jpeg|jpg|gif|webp);base64,[A-Za-z0-9+/=]+$/;

    const uploadEndpointSchema = z.object({
      image: z.string().regex(imageDataUriRegex, 'Invalid image Data URI'),
      customer_code: z.string(),
      measure_datetime: z.string().datetime(),
      measure_type: z.enum(['WATER', 'GAS']),
    });

    const data = uploadEndpointSchema.parse(req.body);

    const { image: imageDataURIString } = data;

    const { mimeType, base64String } = parseDataURI(imageDataURIString);

    const result = await promptWithBase64Image(
      mimeType,
      base64String,
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
