import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import prisma from '@/lib/prisma';
import { authOptions } from '@/lib/auth';

const normalizeImages = (images: unknown) => {
  if (Array.isArray(images)) {
    return JSON.stringify(images.filter((img): img is string => typeof img === 'string' && img.trim().length > 0));
  }
  if (typeof images === 'string') {
    if (images.trim().startsWith('[')) {
      try {
        const parsed = JSON.parse(images);
        if (Array.isArray(parsed)) {
          return JSON.stringify(parsed.filter((img): img is string => typeof img === 'string' && img.trim().length > 0));
        }
      } catch {
        // invalid JSON, fall back to string handling below
      }
    }
    if (images.trim().startsWith('http') || images.trim().startsWith('data:')) {
      return JSON.stringify([images.trim()]);
    }
  }
  return JSON.stringify([]);
};

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const type = searchParams.get('type') || '';
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const sort = searchParams.get('sort') || '';
    const bedrooms = searchParams.get('bedrooms');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;
    const where: any = { status: 'AVAILABLE' };
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { location: { contains: search, mode: 'insensitive' } },
      ];
    }
    if (type) where.type = type;
    if (minPrice) where.price = { gte: parseInt(minPrice) };
    if (maxPrice) where.price = { ...where.price, lte: parseInt(maxPrice) };
    if (bedrooms) where.bedrooms = { gte: parseInt(bedrooms) };
    const orderBy =
      sort === 'priceAsc'
        ? { price: 'asc' as const }
        : sort === 'priceDesc'
        ? { price: 'desc' as const }
        : { createdAt: 'desc' as const };
    const [properties, total] = await Promise.all([
      prisma.property.findMany({
        where,
        include: { user: { select: { id: true, name: true, email: true, image: true } } },
        skip,
        take: limit,
        orderBy,
      }),
      prisma.property.count({ where }),
    ]);
    return NextResponse.json({
      data: properties,
      total,
      page,
      pages: Math.ceil(total / limit),
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch properties' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const body = await request.json();
    const { title, description, price, location, latitude, longitude, bedrooms, bathrooms, area, type, status, images } = body;
    const userId = session.user.id as string;
    const property = await prisma.property.create({
      data: {
        title,
        description,
        price: typeof price === 'string' ? parseFloat(price) : price,
        location,
        latitude: latitude ? (typeof latitude === 'string' ? parseFloat(latitude) : latitude) : null,
        longitude: longitude ? (typeof longitude === 'string' ? parseFloat(longitude) : longitude) : null,
        bedrooms: typeof bedrooms === 'string' ? parseInt(bedrooms) : bedrooms,
        bathrooms: typeof bathrooms === 'string' ? parseInt(bathrooms) : bathrooms,
        area: area ? (typeof area === 'string' ? parseFloat(area) : area) : null,
        type,
        status: typeof status === 'string' ? status : 'AVAILABLE',
        images: normalizeImages(images),
        userId,
      },
      include: { user: true },
    });
    return NextResponse.json(property, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: `Failed to create property: ${message}` }, { status: 500 });
  }
}