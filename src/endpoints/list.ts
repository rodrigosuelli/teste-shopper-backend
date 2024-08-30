import { NextFunction, Request, Response } from 'express';
import { z } from 'zod';
import { requiredMeasureTypes } from '../config';
import prisma from '../db/client';

export async function listEndpoint(
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

    const upperCaseMeasureType = measure_type?.toUpperCase();
    const measureTypeSchema = z.enum(requiredMeasureTypes);
    const validatedMeasureType = upperCaseMeasureType
      ? measureTypeSchema.parse(upperCaseMeasureType)
      : null;

    const customerMeasures = await prisma.measure.findMany({
      where: {
        customerCode: customer_code,
      },
      select: {
        uuid: true,
        datetime: true,
        hasConfirmed: true,
        imageUrl: true,
      },
    });

    if (!customerMeasures.length) {
      res.status(404).json({
        error_code: 'MEASURES_NOT_FOUND',
        error_description: 'Nenhuma leitura encontrada',
      });
      return;
    }

    res.status(200).json({
      customer_code,
      measures: customerMeasures,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({
        error_code: 'INVALID_TYPE',
        error_description: 'Tipo de medição não permitida',
      });

      return;
    }

    next(error);
  }
}
