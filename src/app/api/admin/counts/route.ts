import { NextResponse } from 'next/server';
import { requireAuth, requireRole } from '@/lib/rbac';
import { db } from '@/lib/db';
import { Role } from '@prisma/client';

export async function GET() {
  try {
    const session = await requireAuth();
    requireRole(session, [Role.ADMIN, Role.SUPER_ADMIN]);

    const [pendingTutors, pendingStudyContent, pendingJudgements, pendingDeleteRequests] = await Promise.all([
      db.user.count({ where: { tutorStatus: 'PENDING' } }),
      db.content.count({ where: { status: 'PENDING_REVIEW', deletedAt: null } }),
      db.judgement.count({ where: { status: 'PENDING_REVIEW', deletedAt: null } }),
      db.deleteRequest.count({ where: { status: 'PENDING' } })
    ]);

    return NextResponse.json({
      pendingTutors,
      pendingContent: pendingStudyContent + pendingJudgements,
      pendingDeleteRequests
    });
  } catch (error: any) {
    console.error('Error fetching admin counts:', error);
    if (error.message === 'UNAUTHORIZED') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    if (error.message === 'FORBIDDEN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
