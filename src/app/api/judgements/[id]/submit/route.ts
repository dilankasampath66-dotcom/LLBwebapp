import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { apiRequireTutorApproved } from '@/lib/rbac';

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { session, error } = await apiRequireTutorApproved();
    if (error) return error;

    const { id } = await params;

    const judgement = await db.judgement.findUnique({
      where: { id }
    });

    if (!judgement) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    if (judgement.createdById !== session?.user?.id) {
      return NextResponse.json({ error: 'Forbidden: Not the owner' }, { status: 403 });
    }

    if (!['DRAFT', 'REJECTED'].includes(judgement.status)) {
      return NextResponse.json({ error: 'Judgement is not in a submittable state' }, { status: 400 });
    }

    const updatedJudgement = await db.judgement.update({
      where: { id },
      data: {
        status: 'PENDING_REVIEW',
        reviewNote: null
      }
    });

    return NextResponse.json(updatedJudgement);
  } catch (error) {
    console.error('[JUDGEMENT_SUBMIT]', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
