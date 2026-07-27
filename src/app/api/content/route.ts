import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { apiRequireAuth, apiRequireTutorApproved } from '@/lib/rbac';
import { createContentSchema } from '@/lib/validations/content';

export async function GET(req: Request) {
  try {
    const { session } = await apiRequireAuth();
    const { searchParams } = new URL(req.url);
    
    const levelStr = searchParams.get('level');
    const subjectId = searchParams.get('subject');
    const sessionQuery = searchParams.get('session');
    const cursor = searchParams.get('cursor');
    const statusParam = searchParams.get('status');
    const limit = 12;

    const whereClause: any = {};
    
    // Level filter (array of levels)
    if (levelStr) {
      const levels = levelStr.split(',').map(l => parseInt(l, 10)).filter(l => !isNaN(l));
      if (levels.length > 0) {
        whereClause.level = { in: levels };
      }
    }
    
    // Subject filter
    if (subjectId) {
      whereClause.subjectId = subjectId;
    }
    
    // Session name filter (ILIKE)
    if (sessionQuery) {
      whereClause.sessionName = { contains: sessionQuery, mode: 'insensitive' };
    }

    // Role-based status filtering
    const isAdmin = session?.user?.role === 'ADMIN' || session?.user?.role === 'SUPER_ADMIN';
    if (!isAdmin) {
      whereClause.status = 'APPROVED';
      whereClause.deletedAt = null;
    } else {
      if (statusParam) {
        whereClause.status = statusParam;
      }
      // Admins still don't see deleted by default unless specified
      whereClause.deletedAt = null; 
    }

    const items = await db.content.findMany({
      where: whereClause,
      include: {
        subject: { select: { name: true } },
        createdBy: { select: { fullName: true } }
      },
      take: limit + 1, // Get one extra to check for next page
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
    console.error('[CONTENT_GET]', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { session, error } = await apiRequireTutorApproved();
    if (error) return error;

    const body = await req.json();
    const validatedData = createContentSchema.parse(body);

    const newContent = await db.content.create({
      data: {
        ...validatedData,
        status: 'DRAFT',
        createdById: session!.user.id,
      },
      include: {
        subject: { select: { name: true } }
      }
    });

    return NextResponse.json(newContent, { status: 201 });
  } catch (error: any) {
    console.error('[CONTENT_POST]', error);
    if (error.name === 'ZodError') {
      return NextResponse.json({ error: 'Validation error', details: error.errors }, { status: 400 });
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
