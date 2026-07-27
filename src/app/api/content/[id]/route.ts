import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { apiRequireAuth, apiRequireRole } from '@/lib/rbac';
import { updateContentSchema } from '@/lib/validations/content';

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { session, error } = await apiRequireAuth();
    if (error) return error;
    
    const { id } = await params;

    const content = await db.content.findUnique({
      where: { id },
      include: {
        subject: { select: { name: true } },
        createdBy: { select: { fullName: true } }
      }
    });

    if (!content) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    const isAdmin = session?.user?.role === 'ADMIN' || session?.user?.role === 'SUPER_ADMIN';
    const isOwner = session?.user?.id === content.createdById;

    if (content.status !== 'APPROVED' && !isOwner && !isAdmin) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    if (content.deletedAt !== null && !isAdmin) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    return NextResponse.json(content);
  } catch (error) {
    console.error('[CONTENT_GET_ID]', error);
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
    const content = await db.content.findUnique({ where: { id } });

    if (!content) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    const isAdmin = session?.user?.role === 'ADMIN' || session?.user?.role === 'SUPER_ADMIN';
    const isOwner = session?.user?.id === content.createdById;

    if (!isAdmin && !isOwner) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    if (isOwner && !isAdmin && !['DRAFT', 'PENDING_REVIEW', 'REJECTED'].includes(content.status)) {
      return NextResponse.json({ error: 'Cannot edit content in this status' }, { status: 400 });
    }

    if (content.deletedAt !== null && !isAdmin) {
      return NextResponse.json({ error: 'Cannot edit deleted content' }, { status: 400 });
    }

    const body = await req.json();
    const validatedData = updateContentSchema.parse(body);

    const updatedContent = await db.content.update({
      where: { id },
      data: validatedData
    });

    return NextResponse.json(updatedContent);
  } catch (error: any) {
    console.error('[CONTENT_PATCH_ID]', error);
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
      await db.content.delete({ where: { id } });
      return NextResponse.json({ message: 'Hard deleted successfully' });
    } else {
      await db.content.update({
        where: { id },
        data: { deletedAt: new Date() }
      });
      return NextResponse.json({ message: 'Soft deleted successfully' });
    }
  } catch (error: any) {
    console.error('[CONTENT_DELETE_ID]', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
