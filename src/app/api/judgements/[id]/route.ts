import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { apiRequireAuth, apiRequireRole } from '@/lib/rbac';
import { updateJudgementSchema } from '@/lib/validations/judgement';

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { session, error } = await apiRequireAuth();
    if (error) return error;
    
    const { id } = await params;

    const judgement = await db.judgement.findUnique({
      where: { id },
      include: {
        subject: { select: { name: true } },
        createdBy: { select: { fullName: true } }
      }
    });

    if (!judgement) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    const isAdmin = session?.user?.role === 'ADMIN' || session?.user?.role === 'SUPER_ADMIN';
    const isOwner = session?.user?.id === judgement.createdById;

    if (judgement.status !== 'APPROVED' && !isOwner && !isAdmin) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    if (judgement.deletedAt !== null && !isAdmin) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    return NextResponse.json(judgement);
  } catch (error) {
    console.error('[JUDGEMENT_GET_ID]', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { session, error } = await apiRequireAuth();
    if (error) return error;

    const { id } = await params;
    const judgement = await db.judgement.findUnique({ where: { id } });

    if (!judgement) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    const isAdmin = session?.user?.role === 'ADMIN' || session?.user?.role === 'SUPER_ADMIN';
    const isOwner = session?.user?.id === judgement.createdById;

    if (!isAdmin && !isOwner) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    if (isOwner && !isAdmin && !['DRAFT', 'PENDING_REVIEW', 'REJECTED'].includes(judgement.status)) {
      return NextResponse.json({ error: 'Cannot edit judgement in this status' }, { status: 400 });
    }

    if (judgement.deletedAt !== null && !isAdmin) {
      return NextResponse.json({ error: 'Cannot edit deleted judgement' }, { status: 400 });
    }

    const body = await req.json();
    const validatedData = updateJudgementSchema.parse(body);

    const updatedJudgement = await db.judgement.update({
      where: { id },
      data: validatedData
    });

    return NextResponse.json(updatedJudgement);
  } catch (error: any) {
    console.error('[JUDGEMENT_PATCH_ID]', error);
    if (error.name === 'ZodError') {
      return NextResponse.json({ error: 'Validation error', details: error.errors }, { status: 400 });
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { session, error } = await apiRequireRole(['ADMIN', 'SUPER_ADMIN']);
    if (error) return error;

    const { id } = await params;

    if (session?.user?.role === 'SUPER_ADMIN') {
      await db.judgement.delete({ where: { id } });
      return NextResponse.json({ message: 'Hard deleted successfully' });
    } else {
      await db.judgement.update({
        where: { id },
        data: { deletedAt: new Date() }
      });
      return NextResponse.json({ message: 'Soft deleted successfully' });
    }
  } catch (error: any) {
    console.error('[JUDGEMENT_DELETE_ID]', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
