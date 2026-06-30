import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { verifyToken, extractTokenFromHeader } from '@/lib/jwt';

const transcriptSchema = z.object({
  sessionId: z.string(),
  entry: z.object({
    role: z.enum(['ai', 'candidate']),
    content: z.string(),
    timestamp: z.number(),
    questionIndex: z.number().optional(),
    score: z.number().optional(),
  }),
});

export async function POST(req: NextRequest) {
  try {
    const token = extractTokenFromHeader(req.headers.get('authorization'));
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const payload = verifyToken(token);
    const body = await req.json();
    const parsed = transcriptSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid data' }, { status: 400 });
    }

    const { sessionId, entry } = parsed.data;

    const session = await prisma.session.findFirst({
      where: { id: sessionId, userId: payload.userId },
    });

    if (!session) {
      return NextResponse.json({ error: 'Session not found' }, { status: 404 });
    }

    const currentTranscript = (session.transcript as object[]) || [];
    const updatedTranscript = [...currentTranscript, entry];

    await prisma.session.update({
      where: { id: sessionId },
      data: { transcript: updatedTranscript },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Transcript error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
