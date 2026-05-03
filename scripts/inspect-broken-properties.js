const { PrismaClient } = require('@prisma/client');
(async () => {
  const prisma = new PrismaClient();
  try {
    const props = await prisma.property.findMany();
    const broken = props.filter((p) => {
      if (!p.images || typeof p.images !== 'string') return false;
      return (/\[\\?"data:image\//i.test(p.images) || /data:image\/(png|jpeg|jpg|gif|webp|bmp);base64/i.test(p.images));
    });
    broken.forEach((p) => {
      console.log(`${p.id} | ${p.title} | images=${typeof p.images === 'string' ? p.images.slice(0, 200).replace(/\r?\n/g, ' ') : p.images}`);
    });
  } catch (error) {
    console.error(error);
  } finally {
    await prisma.$disconnect();
  }
})();
