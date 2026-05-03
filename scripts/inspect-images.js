const { PrismaClient } = require('@prisma/client');
(async () => {
  const prisma = new PrismaClient();
  try {
    const props = await prisma.property.findMany({ orderBy: { createdAt: 'asc' } });
    console.log(JSON.stringify(props.map(p => ({ id: p.id, title: p.title, images: p.images, image: p.image || null })), null, 2));
  } catch (error) {
    console.error(error);
  } finally {
    await prisma.$disconnect();
  }
})();
