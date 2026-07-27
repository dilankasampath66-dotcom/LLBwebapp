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

    const content = await db.content.findUnique({
      where: { id }
    });

    if (!content) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    if (content.createdById !== session?.user?.id) {
      return NextResponse.json({ error: 'Forbidden: Not the owner' }, { status: 403 });
    }

    if (!['DRAFT', 'REJECTED'].includes(content.status)) {
      return NextResponse.json({ error: 'Content is not in a submittable state' }, { status: 400 });
    }

    const updatedContent = await db.content.update({
      where: { id },
      data: {
        status: 'PENDING_REVIEW',
        reviewNote: null // Clear previous review note if resubmitting
      }
    });

    return NextResponse.json(updatedContent);
  } catch (error) {
    console.error('[CONTENT_SUBMIT]', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
