import { NextResponse } from 'next/server';
import { requireTutorApproved } from '@/lib/rbac';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const session = await requireTutorApproved();
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;

    const [content, judgements] = await Promise.all([
      db.content.findMany({
        where: {
          createdById: userId,
          deletedAt: null,
        },
        include: {
          subject: {
            select: {
              name: true,
              code: true,
            }
          }
        },
        orderBy: {
          updatedAt: 'desc',
        },
      }),
      db.judgement.findMany({
        where: {
          createdById: userId,
          deletedAt: null,
        },
        orderBy: {
          updatedAt: 'desc',
        },
      })
    ]);

    return NextResponse.json({ content, judgements });
  } catch (error) {
    console.error('Fetch tutor submissions error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
