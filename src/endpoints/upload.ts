import { NextFunction, Request, Response } from 'express';
import { z } from 'zod';
import { fromError } from 'zod-validation-error';
import { v4 as uuidv4 } from 'uuid';
import { promptWithBase64Image } from '../services/geminiApi';
import saveBase64FileToDisk from '../utils/saveBase64FileToDisk';
import { PORT, uploadsFolderName, uploadsFolderPath } from '../config';

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

    // Gemini prompt
    const result = await promptWithBase64Image(
      'image/png',
      imageBase64String,
      `Return the consumption value presented by the meter in the image as an integer and nothing else.
       If it is not possible to detect the value then an error message can be returned,
       but make sure that the error message does not contain any numbers.`
    );

    const resultMessage = result.response.text();

    const measureValue = parseInt(resultMessage, 10);
    const measureUuid = uuidv4();

    const fileNameWithExt = `${measureUuid}.png`;
    const filePathWithExt = `${uploadsFolderPath}/${fileNameWithExt}`;
    const uploadedImageUrl = `http://localhost:${PORT}/${uploadsFolderName}/${fileNameWithExt}`;

    // Save file to Uploads folder
    saveBase64FileToDisk(filePathWithExt, imageBase64String);

    // Gemini was unable to detect the value in the image
    // if (Number.isNaN(measureValue)) {
    //   throw new Error(
    //     'The server was unable to detect the value in the image sent, please make sure the image sent has a clear and visible value to be detected.'
    //   );
    // }

    res.status(200).json({
      measure_value: measureValue,
      measure_uuid: measureUuid,
      image_url: uploadedImageUrl,
    });
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
