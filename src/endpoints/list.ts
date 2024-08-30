import { NextFunction, Request, Response } from 'express';
import { z } from 'zod';
import prisma from '../db/client';
import {
  getRegisteredMeasureTypes,
  requiredMeasureTypes,
} from './helpers/measureTypes.helpers';

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

    let customerMeasures = [];

    // Filter by measure type
    if (validatedMeasureType) {
      const registeredMeasureTypes = await getRegisteredMeasureTypes();
      const selectedMeasureTypeId =
        registeredMeasureTypes[validatedMeasureType].id;

      customerMeasures = await prisma.measure.findMany({
        where: {
          customer_code,
          measure_type_id: selectedMeasureTypeId,
        },
        select: {
          measure_uuid: true,
          measure_datetime: true,
          has_confirmed: true,
          image_url: true,
          measureType: { select: { measure_type: true } },
        },
      });

      // Format: flatten the measureType relation field
      customerMeasures = customerMeasures.map((measure) => ({
        measure_uuid: measure.measure_uuid,
        measure_datetime: measure.measure_datetime,
        has_confirmed: measure.has_confirmed,
        image_url: measure.image_url,
        measure_type: measure.measureType.measure_type, // Flattening the measureType object
      }));
    } else {
      customerMeasures = await prisma.measure.findMany({
        where: {
          customer_code,
        },
        select: {
          measure_uuid: true,
          measure_datetime: true,
          has_confirmed: true,
          image_url: true,
        },
      });
    }

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
