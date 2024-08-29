import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting seeding process...');

  const populatedMeasureTypes = await prisma.measureType.createManyAndReturn({
    data: [{ type: 'WATER' }, { type: 'GAS' }],
    skipDuplicates: true,
  });

  console.log('Inserted data:');
  console.log(populatedMeasureTypes);
  console.log('Seeding completed with success.');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
