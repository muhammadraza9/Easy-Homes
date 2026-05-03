import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import prisma from '@/lib/prisma';
import { authOptions } from '@/lib/auth';

async function getOrCreateUser(session: any) {
  if (!session?.user) return null;

  let user = null;

  if (session.user.id) {
    user = await prisma.user.findUnique({ where: { id: session.user.id } });
  }

  if (!user && session.user.email) {
    user = await prisma.user.findUnique({ where: { email: session.user.email } });
  }

  if (!user && session.user.email) {
    user = await prisma.user.create({
      data: {
        email: session.user.email,
        name: session.user.name || '',
        image: session.user.image || '',
      },
    });
  }

  return user;
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const user = await getOrCreateUser(session);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const properties = await prisma.property.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(properties);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch properties' }, { status: 500 });
  }
}
