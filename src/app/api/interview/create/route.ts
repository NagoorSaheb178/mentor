import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { verifyToken, extractTokenFromHeader } from '@/lib/jwt';

const createSchema = z.object({
  interviewType: z.enum(['behavioral', 'technical', 'systemDesign', 'hr']),
});

export async function POST(req: NextRequest) {
  try {
    const token = extractTokenFromHeader(req.headers.get('authorization'));
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const payload = verifyToken(token);
    const body = await req.json();
    const parsed = createSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid interview type' }, { status: 400 });
    }

    const session = await prisma.session.create({
      data: {
        userId: payload.userId,
        interviewType: parsed.data.interviewType,
        status: 'active',
        transcript: [],
      },
    });

    return NextResponse.json({ sessionId: session.id, session });
  } catch (error) {
    console.error('Create interview error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
