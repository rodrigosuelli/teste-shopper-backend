import { NextFunction, Request, Response } from 'express';

type UploadReqBody = {
  image?: string;
  customer_code?: string;
  measure_datetime?: string;
  measure_type?: string;
};

export function upload(req: Request, res: Response, next: NextFunction) {
  try {
    const { image, customer_code, measure_datetime, measure_type } =
      req.body as UploadReqBody;

    console.log(req.body);

    if (measure_type !== 'WATER' && measure_type !== 'GAS') {
      throw new Error(
        'Error: Measure type needs to be equals to `WATER` or `GAS`'
      );
    }

    res.status(200).json({ success: true });
  } catch (error) {
    next(error);
  }
}
