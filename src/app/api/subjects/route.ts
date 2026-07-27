import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const levelParam = searchParams.get('level');
    
    let whereClause = {};
    if (levelParam) {
      const levels = levelParam.split(',').map(l => parseInt(l.trim(), 10)).filter(l => !isNaN(l));
      if (levels.length > 0) {
        whereClause = { level: { in: levels } };
      }
    }

    const subjects = await db.subject.findMany({
      where: whereClause,
      orderBy: [
        { level: 'asc' },
        { name: 'asc' }
      ]
    });

    return NextResponse.json({ subjects }, {
      headers: {
        'Cache-Control': 'public, max-age=300, stale-while-revalidate=600'
      }
    });
  } catch (error) {
    console.error('[SUBJECTS_GET]', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
