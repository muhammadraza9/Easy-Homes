import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const limit = searchParams.get('limit');

  const properties = await prisma.property.findMany({
    orderBy: { createdAt: 'desc' },
    take: limit ? Number(limit) : undefined,
    include: { user: true },
  });

  return NextResponse.json(properties);
}