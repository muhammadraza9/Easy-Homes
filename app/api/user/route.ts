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
    return NextResponse.json(user);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch user' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const user = await getOrCreateUser(session);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const body = await request.json();
    const updatedUser = await prisma.user.update({ where: { id: user.id }, data: body });
    return NextResponse.json(updatedUser);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update user' }, { status: 500 });
  }
}
