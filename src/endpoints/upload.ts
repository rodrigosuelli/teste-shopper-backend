import { NextFunction, Request, Response } from 'express';
import { z } from 'zod';
import { fromError } from 'zod-validation-error';
import { v4 as uuidv4 } from 'uuid';
import { promptWithBase64Image } from '../services/geminiApi';
import saveBase64FileToDisk from '../utils/saveBase64FileToDisk';
import { PORT, uploadsFolderName, uploadsFolderPath } from '../config';
import prisma from '../db/client';

export async function upload(req: Request, res: Response, next: NextFunction) {
  try {
    const requiredMeasureTypes = ['WATER', 'GAS'] as const;

    const uploadEndpointSchema = z.object({
      image: z.string().base64(),
      customer_code: z.string(),
      measure_datetime: z.string().datetime(),
      measure_type: z.enum(requiredMeasureTypes),
    });

    const data = uploadEndpointSchema.parse(req.body);
    const {
      image: imageBase64String,
      customer_code,
      measure_type,
      measure_datetime,
    } = data;

    const measureTypesQuery = await prisma.measureType.findMany({
      select: { id: true, type: true },
    });

    const availableMeasureTypes: Record<string, { id: number; type: string }> =
      {};

    // Add each type as a property to the availableMeasureTypes object
    measureTypesQuery.forEach(({ id, type }) => {
      availableMeasureTypes[type] = { id, type };
    });

    const selectedMeasureTypeId = availableMeasureTypes[measure_type].id;

    // Check for missing required measure types
    const missingTypes = requiredMeasureTypes.filter(
      (type) => !availableMeasureTypes[type]
    );

    if (missingTypes.length > 0) {
      throw new Error(
        `The following required measure types are not registered in the database: ${missingTypes.join(', ')}`
      );
    }

    const alreadyRegisteredMeasure = await prisma.measure.findUnique({
      where: {
        uuid: customer_code,
        measureTypeId: selectedMeasureTypeId,
      },
    });

    // Leitura já cadastrada no mês
    if (alreadyRegisteredMeasure) {
      res.status(409).json({
        error_code: 'DOUBLE_REPORT',
        error_description: 'Leitura do mês já realizada',
      });
      return;
    }

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

    // Save file to Uploads folder
    const fileNameWithExt = `${measureUuid}.png`;
    const filePathWithExt = `${uploadsFolderPath}/${fileNameWithExt}`;
    saveBase64FileToDisk(filePathWithExt, imageBase64String);
    const uploadedImageUrl = `http://localhost:${PORT}/${uploadsFolderName}/${fileNameWithExt}`;

    // Cadastrar measure no banco de dados
    const newMeasure = await prisma.measure.create({
      data: {
        customerCode: customer_code,
        datetime: measure_datetime,
        imageUrl: uploadedImageUrl,
        measureValue,
        measureTypeId: selectedMeasureTypeId,
      },
    });

    res.status(200).json({
      measure_value: newMeasure.measureValue,
      measure_uuid: newMeasure.uuid,
      image_url: newMeasure.imageUrl,
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
