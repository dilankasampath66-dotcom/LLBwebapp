import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/rbac';
import { db } from '@/lib/db';
import { logAudit } from '@/lib/audit';

export async function POST(req: Request) {
  try {
    const session = await requireAuth();
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const userId = session.user.id;
    
    // Check current status
    const user = await db.user.findUnique({
      where: { id: userId },
      select: { tutorStatus: true }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    if (user.tutorStatus === 'PENDING') {
      return NextResponse.json({ error: 'Application already pending' }, { status: 409 });
    }

    if (user.tutorStatus === 'APPROVED') {
      return NextResponse.json({ error: 'Already a tutor' }, { status: 409 });
    }

    const body = await req.json();

    await db.user.update({
      where: { id: userId },
      data: {
        tutorStatus: 'PENDING',
        tutorNote: body.note || null,
      }
    });

    await logAudit(userId, 'TUTOR_APPLICATION_SUBMITTED', 'User', userId, { note: body.note });

    return NextResponse.json({ message: 'Application submitted successfully' });
  } catch (error) {
    console.error('Tutor application error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const session = await requireAuth();
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await db.user.findUnique({
      where: { id: session.user.id },
      select: { tutorStatus: true, tutorNote: true }
    });

    return NextResponse.json(user);
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
