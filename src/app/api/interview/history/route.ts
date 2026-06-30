import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyToken, extractTokenFromHeader } from '@/lib/jwt';

export async function GET(req: NextRequest) {
  try {
    const token = extractTokenFromHeader(req.headers.get('authorization'));
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const payload = verifyToken(token);

    const sessions = await prisma.session.findMany({
      where: { userId: payload.userId },
      include: { feedback: true },
      orderBy: { startedAt: 'desc' },
    });

    return NextResponse.json({ sessions });
  } catch (error) {
    console.error('History error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
