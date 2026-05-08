import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  /* CREATE SEED USER */
  const user = await prisma.user.upsert({
    where: { email: 'seed@easyhomes.com' },
    update: {},
    create: {
      id: 'seed-user-1',
      email: 'seed@easyhomes.com',
      name: 'Easy Homes',
      image: '',
    },
  });

  /* DELETE OLD SEED PROPERTIES */
  await prisma.property.deleteMany({
    where: { userId: 'seed-user-1' },
  });

  /* CREATE 15 PROPERTIES */
  const properties = [
    {
      title: 'Modern Luxury Apartment',
      description: 'A stunning modern apartment located in the heart of the city. Features floor-to-ceiling windows, premium finishes, and breathtaking skyline views. Perfect for professionals seeking an upscale urban lifestyle.',
      price: 2500000,
      location: 'DHA Phase 6, Lahore',
      bedrooms: 3,
      bathrooms: 2,
      area: 185,
      type: 'APARTMENT',
      status: 'AVAILABLE',
      featured: true,
      images: JSON.stringify(['https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800']),
    },
    {
      title: 'Elegant Family Villa',
      description: 'Spacious family villa with a private swimming pool, manicured garden, and modern interiors. Set in a gated community with 24/7 security. Ideal for families who value privacy and luxury.',
      price: 8500000,
      location: 'Bahria Town, Rawalpindi',
      bedrooms: 5,
      bathrooms: 4,
      area: 420,
      type: 'VILLA',
      status: 'AVAILABLE',
      featured: true,
      images: JSON.stringify(['https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800']),
    },
    {
      title: 'Cozy Studio Apartment',
      description: 'A beautifully designed studio apartment perfect for singles or young couples. Fully furnished with modern appliances, high-speed internet, and walking distance to major shopping centers.',
      price: 950000,
      location: 'Gulberg III, Lahore',
      bedrooms: 1,
      bathrooms: 1,
      area: 65,
      type: 'APARTMENT',
      status: 'AVAILABLE',
      featured: false,
      images: JSON.stringify(['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800']),
    },
    {
      title: 'Spacious Corner House',
      description: 'A well-maintained corner house with a large garden and ample parking space. Bright and airy rooms with quality fixtures throughout. Located in a peaceful residential area close to top schools.',
      price: 4200000,
      location: 'F-10, Islamabad',
      bedrooms: 4,
      bathrooms: 3,
      area: 280,
      type: 'HOUSE',
      status: 'AVAILABLE',
      featured: false,
      images: JSON.stringify(['https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800']),
    },
    {
      title: 'Penthouse with Panoramic Views',
      description: 'An exclusive penthouse sitting atop a premium high-rise building. Enjoy 360-degree city views from a massive private terrace. Features include a home cinema, jacuzzi, and smart home automation.',
      price: 15000000,
      location: 'Clifton Block 5, Karachi',
      bedrooms: 4,
      bathrooms: 4,
      area: 520,
      type: 'APARTMENT',
      status: 'AVAILABLE',
      featured: true,
      images: JSON.stringify(['https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800']),
    },
    {
      title: 'Charming Townhouse',
      description: 'A charming two-story townhouse with a private rooftop terrace. Recently renovated with new kitchen, bathrooms, and flooring. Great community with parks and jogging tracks nearby.',
      price: 3100000,
      location: 'Johar Town, Lahore',
      bedrooms: 3,
      bathrooms: 2,
      area: 175,
      type: 'HOUSE',
      status: 'AVAILABLE',
      featured: false,
      images: JSON.stringify(['https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?w=800']),
    },
    {
      title: 'Waterfront Luxury Villa',
      description: 'A breathtaking waterfront villa with direct lake access and a private dock. Featuring an open-plan living area, gourmet kitchen, and wrap-around deck for outdoor entertaining.',
      price: 12000000,
      location: 'Rawal Lake View, Islamabad',
      bedrooms: 5,
      bathrooms: 5,
      area: 480,
      type: 'VILLA',
      status: 'AVAILABLE',
      featured: true,
      images: JSON.stringify(['https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800']),
    },
    {
      title: 'Budget-Friendly Flat',
      description: 'An affordable and comfortable flat ideal for first-time buyers or investors. Well-maintained building with elevator, generator backup, and security guard. Close to public transport and markets.',
      price: 750000,
      location: 'Nazimabad, Karachi',
      bedrooms: 2,
      bathrooms: 1,
      area: 90,
      type: 'APARTMENT',
      status: 'AVAILABLE',
      featured: false,
      images: JSON.stringify(['https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800']),
    },
    {
      title: 'Modern Office Conversion Loft',
      description: 'A unique industrial-style loft converted from a historic building. Exposed brick walls, high ceilings, and polished concrete floors create a truly one-of-a-kind living space in the city center.',
      price: 5500000,
      location: 'MM Alam Road, Lahore',
      bedrooms: 2,
      bathrooms: 2,
      area: 210,
      type: 'APARTMENT',
      status: 'AVAILABLE',
      featured: false,
      images: JSON.stringify(['https://images.unsplash.com/photo-1536376072261-38c75010e6c9?w=800']),
    },
    {
      title: 'Countryside Farm House',
      description: 'A serene farmhouse retreat surrounded by lush green fields. Features a large courtyard, fruit orchard, and traditional architecture with modern amenities. Perfect for weekend getaways or permanent residence.',
      price: 6800000,
      location: 'Bedian Road, Lahore',
      bedrooms: 6,
      bathrooms: 4,
      area: 650,
      type: 'HOUSE',
      status: 'AVAILABLE',
      featured: false,
      images: JSON.stringify(['https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800']),
    },
    {
      title: 'Executive Studio Suite',
      description: 'A premium executive studio suite in a serviced apartment building. Includes daily housekeeping, concierge service, gym, and rooftop pool. Fully furnished and ready to move in immediately.',
      price: 1800000,
      location: 'Blue Area, Islamabad',
      bedrooms: 1,
      bathrooms: 1,
      area: 75,
      type: 'APARTMENT',
      status: 'AVAILABLE',
      featured: false,
      images: JSON.stringify(['https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800']),
    },
    {
      title: 'Twin Bungalow with Garden',
      description: 'A beautifully landscaped twin bungalow featuring a spacious living room, modern kitchen, and a private garden. Quiet neighborhood with easy access to hospitals, schools, and shopping malls.',
      price: 5200000,
      location: 'E-7, Islamabad',
      bedrooms: 4,
      bathrooms: 3,
      area: 320,
      type: 'HOUSE',
      status: 'AVAILABLE',
      featured: false,
      images: JSON.stringify(['https://images.unsplash.com/photo-1576941089067-2de3c901e126?w=800']),
    },
    {
      title: 'Sea View Luxury Apartment',
      description: 'Wake up to stunning sea views every morning in this luxury apartment. Features premium marble flooring, imported kitchen cabinets, and a large balcony overlooking the Arabian Sea.',
      price: 9500000,
      location: 'Defence View, Karachi',
      bedrooms: 3,
      bathrooms: 3,
      area: 230,
      type: 'APARTMENT',
      status: 'AVAILABLE',
      featured: true,
      images: JSON.stringify(['https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800']),
    },
    {
      title: 'Affordable 2-Bed House',
      description: 'A neat and tidy two-bedroom house perfect for a small family. Recently painted with new tiles, modern bathroom fittings, and a small garden at the back. Great value for money in a prime location.',
      price: 1950000,
      location: 'Satellite Town, Rawalpindi',
      bedrooms: 2,
      bathrooms: 1,
      area: 110,
      type: 'HOUSE',
      status: 'AVAILABLE',
      featured: false,
      images: JSON.stringify(['https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800']),
    },
    {
      title: 'Grand Corner Villa',
      description: 'An impressive corner villa spread over a 1-kanal plot with a basement, ground floor, and first floor. Features a grand entrance, marble flooring throughout, and a beautifully designed outdoor space.',
      price: 18000000,
      location: 'DHA Phase 2, Islamabad',
      bedrooms: 6,
      bathrooms: 6,
      area: 750,
      type: 'VILLA',
      status: 'AVAILABLE',
      featured: true,
      images: JSON.stringify(['https://images.unsplash.com/photo-1625602812206-5ec545ca1231?w=800']),
    },
  ];

  for (const property of properties) {
    await prisma.property.create({
      data: {
        ...property,
        userId: user.id,
      },
    });
  }

  console.log('✅ Seeded 15 properties successfully');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });