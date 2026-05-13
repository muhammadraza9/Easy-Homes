import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  if (!id) {
    return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
  }

  const property = await prisma.property.findUnique({
    where: { id },
    include: { user: true },
  });

  if (!property) {
    return NextResponse.json({ error: 'Property not found' }, { status: 404 });
  }

  return NextResponse.json(property);
}