import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import prisma from '@/lib/prisma';
import { authOptions } from '@/lib/auth';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const saved = await prisma.savedProperty.create({
      data: {
        userId: session.user.id,
        propertyId: params.id,
      },
    });
    return NextResponse.json(saved, { status: 201 });
  } catch (error: any) {
    if (error.code === 'P2002') {
      return NextResponse.json({ error: 'Already saved' }, { status: 409 });
    }
    return NextResponse.json({ error: 'Failed to save property' }, { status: 500 });
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
    await prisma.savedProperty.delete({
      where: {
        userId_propertyId: {
          userId: session.user.id,
          propertyId: params.id,
        },
      },
    });
    return NextResponse.json({ message: 'Property unsaved' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to unsave property' }, { status: 500 });
  }
}