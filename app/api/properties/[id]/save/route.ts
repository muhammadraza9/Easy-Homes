import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import prisma from '@/lib/prisma';
import { authOptions } from '@/lib/auth';

// ❤️ SAVE PROPERTY
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // ✅ PREVENT DUPLICATE BEFORE INSERT
    const existing = await prisma.savedProperty.findFirst({
      where: {
        userId: session.user.id,
        propertyId: params.id,
      },
    });

    if (existing) {
      return NextResponse.json(
        { error: 'Already saved' },
        { status: 409 }
      );
    }

    const saved = await prisma.savedProperty.create({
      data: {
        userId: session.user.id,
        propertyId: params.id,
      },
    });

    return NextResponse.json(saved, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to save property' },
      { status: 500 }
    );
  }
}

// ❌ UNSAVE PROPERTY
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await prisma.savedProperty.delete({
      where: {
        userId_propertyId: {
          userId: session.user.id,
          propertyId: params.id,
        },
      },
    });

    return NextResponse.json({
      message: 'Property unsaved',
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to unsave property' },
      { status: 500 }
    );
  }
}