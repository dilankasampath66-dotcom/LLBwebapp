import { NextRequest, NextResponse } from 'next/server';
import { requireAuth, requireRole } from '@/lib/rbac';
import { db } from '@/lib/db';
import { Role, TutorStatus } from '@prisma/client';

export async function GET(request: NextRequest) {
  try {
    const session = await requireAuth();
    requireRole(session, [Role.ADMIN, Role.SUPER_ADMIN]);

    const { searchParams } = new URL(request.url);
    const statusParam = searchParams.get('status') || 'PENDING';
    
    // Validate status
    if (!['PENDING', 'APPROVED', 'REJECTED', 'NONE'].includes(statusParam)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
    }

    const users = await db.user.findMany({
      where: {
        tutorStatus: statusParam as TutorStatus
      },
      select: {
        id: true,
        fullName: true,
        email: true,
        phone: true,
        studyYear: true,
        tutorNote: true,
        createdAt: true,
        image: true
      },
      orderBy: {
        createdAt: 'asc'
      }
    });

    return NextResponse.json(users);
  } catch (error: any) {
    console.error('Error fetching tutor applications:', error);
    if (error.message === 'UNAUTHORIZED') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    if (error.message === 'FORBIDDEN') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
