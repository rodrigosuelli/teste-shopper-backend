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

  type MeasureType = Pick<
    (typeof measureTypesArr)[number],
    'id' | 'measure_type'
  >;

  // Create registeredMeasureTypes obj with each measure_type as a property
  const registeredMeasureTypes = measureTypesArr.reduce<
    Record<string, MeasureType>
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

export { requiredMeasureTypes, getRegisteredMeasureTypes };
