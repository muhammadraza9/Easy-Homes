const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const properties = await prisma.property.findMany();
  
  const images = [
    'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800',
    'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800',
    'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800',
    'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800',
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800',
    'https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?w=800',
    'https://images.unsplash.com/photo-1576941089067-2de3c901e126?w=800',
    'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800',
  ];

  for (let i = 0; i < properties.length; i++) {
    const image = images[i % images.length];
    await prisma.property.update({
      where: { id: properties[i].id },
      data: { images: JSON.stringify([image]) },
    });
    console.log('Updated:', properties[i].title);
  }

  console.log('Done!');
  await prisma.$disconnect();
}

main();