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

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const property = await prisma.property.findUnique({
      where: { id: params.id },
      include: { user: { select: { id: true, name: true, email: true, image: true, phone: true } } },
    });
    if (!property) {
      return NextResponse.json({ error: 'Property not found' }, { status: 404 });
    }
    return NextResponse.json(property);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch property' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const property = await prisma.property.findUnique({ where: { id: params.id } });
    if (!property || property.userId !== session.user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    const body = await request.json();
    const updated = await prisma.property.update({
      where: { id: params.id },
      data: {
        title: body.title,
        description: body.description,
        price: parseFloat(body.price),
        location: body.location,
        latitude: body.latitude ? parseFloat(body.latitude) : null,
        longitude: body.longitude ? parseFloat(body.longitude) : null,
        bedrooms: parseInt(body.bedrooms),
        bathrooms: parseInt(body.bathrooms),
        area: body.area ? parseFloat(body.area) : null,
        type: body.type,
        status: typeof body.status === 'string' ? body.status : 'AVAILABLE',
        images: normalizeImages(body.images),
      },
      include: { user: true },
    });
    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update property' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const property = await prisma.property.findUnique({ where: { id: params.id } });
    if (!property || property.userId !== session.user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    await prisma.property.delete({ where: { id: params.id } });
    return NextResponse.json({ message: 'Property deleted' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete property' }, { status: 500 });
  }
}