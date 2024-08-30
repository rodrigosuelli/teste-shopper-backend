import { requiredMeasureTypes } from '../config';
import prisma from '../db/client';

export default async function getRegisteredMeasureTypes() {
  const measureTypesArr = await prisma.measureType.findMany({
    select: { id: true, measure_type: true },
  });

  if (!measureTypesArr.length) {
    throw new Error('No measure types are registered in the database');
  }

  // Create registeredMeasureTypes obj with each measure_type as a property
  const registeredMeasureTypes = measureTypesArr.reduce<
    Record<
      string,
      Pick<(typeof measureTypesArr)[number], 'id' | 'measure_type'>
    >
  >((acc, { id, measure_type }) => {
    acc[measure_type] = { id, measure_type };
    return acc;
  }, {});

  const missingTypes = requiredMeasureTypes.filter(
    (type) => !registeredMeasureTypes[type]
  );

  if (missingTypes.length > 0) {
    throw new Error(
      `The following required measure types are not registered in the database: ${missingTypes.join(', ')}`
    );
  }

  return registeredMeasureTypes;
}
