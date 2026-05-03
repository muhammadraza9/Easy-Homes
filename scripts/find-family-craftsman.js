const { PrismaClient } = require('@prisma/client');
(async () => {
  const prisma = new PrismaClient();
  try {
    const prop = await prisma.property.findFirst({ where: { title: 'Family Craftsman' } });
    console.log(JSON.stringify(prop, null, 2));
  } catch (error) {
    console.error(error);
  } finally {
    await prisma.$disconnect();
  }
})();
