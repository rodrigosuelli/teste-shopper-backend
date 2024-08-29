import { NextFunction, Request, Response } from 'express';
import { z } from 'zod';
import prisma from '../db/client';

export async function confirmEndpoint(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const confirmEndpointSchema = z.object({
      measure_uuid: z.string(),
      confirmed_value: z.number().int().nonnegative(),
    });

    const data = confirmEndpointSchema.parse(req.body);
    const { measure_uuid, confirmed_value } = data;

    const measureFound = await prisma.measure.findUnique({
      where: {
        uuid: measure_uuid,
      },
    });

    // Measure Not Found
    if (!measureFound) {
      res.status(404).json({
        error_code: 'MEASURE_NOT_FOUND',
        error_description: 'Leitura não encontrada',
      });
      return;
    }

    if (measureFound.hasConfirmed) {
      res.status(409).json({
        error_code: 'CONFIRMATION_DUPLICATE',
        error_description: 'Leitura já confirmada',
      });
      return;
    }

    // Update measure in the database
    await prisma.measure.update({
      where: {
        uuid: measure_uuid,
      },
      data: {
        measureValue: confirmed_value,
        hasConfirmed: true,
      },
    });

    res.status(200).json({
      success: true,
    });
  } catch (error) {
    next(error);
  }
}
