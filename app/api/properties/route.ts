import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import prisma from '@/lib/prisma';
import { authOptions } from '@/lib/auth';

/* IMAGE NORMALIZER */
const normalizeImages = (images: unknown): string => {
  if (Array.isArray(images)) return JSON.stringify(images);
  if (typeof images === 'string') {
    try { JSON.parse(images); return images; }
    catch { return JSON.stringify([images]); }
  }
  return JSON.stringify([]);
};
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page  = Math.max(1, Number(searchParams.get('page')  ?? 1));
    const limit = Math.max(1, Number(searchParams.get('limit') ?? 15));
    const skip  = (page - 1) * limit;

    const [properties, total] = await Promise.all([
      prisma.property.findMany({
        skip,
        take: limit,
        include: { user: true },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.property.count(),
    ]);

    return NextResponse.json({
      data: properties,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        hasNextPage: page * limit < total,
      },
    });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch properties' }, { status: 500 });
  }
}

/* CREATE PROPERTY */
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();

    const required = ['title', 'description', 'price', 'location', 'type'];
    const missing  = required.filter((f) => !body[f]);
    if (missing.length) {
      return NextResponse.json(
        { error: `Missing required fields: ${missing.join(', ')}` },
        { status: 400 }
      );
    }

    const property = await prisma.property.create({
      data: {
        title:       body.title,
        description: body.description,
        price:       Number(body.price),
        location:    body.location,
        latitude:    Number(body.latitude)  || 0,
        longitude:   Number(body.longitude) || 0,
        bedrooms:    Number(body.bedrooms)  || 0,
        bathrooms:   Number(body.bathrooms) || 0,
        area:        Number(body.area)      || 0,
        type:        body.type,
        status:      body.status || 'AVAILABLE',
        images:      normalizeImages(body.images),
        userId:      session.user.id,
      },
      include: { user: true },
    });

    return NextResponse.json(property, { status: 201 });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to create property' }, { status: 500 });
  }
}