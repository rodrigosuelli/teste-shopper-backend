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
        measure_uuid,
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

    if (measureFound.has_confirmed) {
      res.status(409).json({
        error_code: 'CONFIRMATION_DUPLICATE',
        error_description: 'Leitura já confirmada',
      });
      return;
    }

    // Update measure in the database
    await prisma.measure.update({
      where: {
        measure_uuid,
      },
      data: {
        measure_value: confirmed_value,
        has_confirmed: true,
      },
    });

    res.status(200).json({
      success: true,
    });
  } catch (error) {
    next(error);
  }
}
