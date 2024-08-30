import prisma from '../../db/client';

// MeasureTypes
const requiredMeasureTypes = ['WATER', 'GAS'] as const;

async function getRegisteredMeasureTypes() {
  const measureTypesArr = await prisma.measureType.findMany({
    select: { id: true, measure_type: true },
  });

  if (!measureTypesArr.length) {
    throw new Error('No measure types are registered in the database');
  }

  type MeasureType = {
    id: number;
    measure_type: string;
  };

  const registeredMeasureTypes: Record<string, MeasureType> = {};

  // Add each type as a property to the registeredMeasureTypes object
  measureTypesArr.forEach((e: MeasureType) => {
    registeredMeasureTypes[e.measure_type] = {
      id: e.id,
      measure_type: e.measure_type,
    };
  });

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

export { requiredMeasureTypes, getRegisteredMeasureTypes };
