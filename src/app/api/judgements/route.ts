import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { apiRequireAuth, apiRequireTutorApproved } from '@/lib/rbac';
import { createJudgementSchema } from '@/lib/validations/judgement';

export async function GET(req: Request) {
  try {
    const { session } = await apiRequireAuth();
    const { searchParams } = new URL(req.url);
    
    const levelStr = searchParams.get('level');
    const subjectId = searchParams.get('subject');
    const cursor = searchParams.get('cursor');
    const statusParam = searchParams.get('status');
    const limit = 12;

    const whereClause: any = {};
    
    if (levelStr) {
      const levels = levelStr.split(',').map(l => parseInt(l, 10)).filter(l => !isNaN(l));
      if (levels.length > 0) {
        whereClause.level = { in: levels };
      }
    }
    
    if (subjectId) {
      whereClause.subjectId = subjectId;
    }

    const isAdmin = session?.user?.role === 'ADMIN' || session?.user?.role === 'SUPER_ADMIN';
    if (!isAdmin) {
      whereClause.status = 'APPROVED';
      whereClause.deletedAt = null;
    } else {
      if (statusParam) {
        whereClause.status = statusParam;
      }
      whereClause.deletedAt = null; 
    }

    const items = await db.judgement.findMany({
      where: whereClause,
      include: {
        subject: { select: { name: true } },
        createdBy: { select: { fullName: true } }
      },
      take: limit + 1,
      cursor: cursor ? { id: cursor } : undefined,
      orderBy: { createdAt: 'desc' }
    });

    let nextCursor: string | null = null;
    if (items.length > limit) {
      const nextItem = items.pop();
      nextCursor = nextItem!.id;
    }

    return NextResponse.json({ items, nextCursor });
  } catch (error: any) {
    console.error('[JUDGEMENTS_GET]', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { session, error } = await apiRequireTutorApproved();
    if (error) return error;

    const body = await req.json();
    const validatedData = createJudgementSchema.parse(body);

    const newJudgement = await db.judgement.create({
      data: {
        ...validatedData,
        status: 'DRAFT',
        createdById: session!.user.id,
      },
      include: {
        subject: { select: { name: true } }
      }
    });

    return NextResponse.json(newJudgement, { status: 201 });
  } catch (error: any) {
    console.error('[JUDGEMENTS_POST]', error);
    if (error.name === 'ZodError') {
      return NextResponse.json({ error: 'Validation error', details: error.errors }, { status: 400 });
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
