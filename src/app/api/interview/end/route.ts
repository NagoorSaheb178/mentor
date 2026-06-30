import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { verifyToken, extractTokenFromHeader } from '@/lib/jwt';
import { buildFeedbackPrompt } from '@/ai/prompts/system';
import { InterviewType } from '@/constants/interviewTypes';

const endSchema = z.object({
  sessionId: z.string(),
  finalTranscript: z.array(
    z.object({
      role: z.enum(['ai', 'candidate']),
      content: z.string(),
      timestamp: z.number(),
    })
  ),
});

export async function POST(req: NextRequest) {
  try {
    const token = extractTokenFromHeader(req.headers.get('authorization'));
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const payload = verifyToken(token);
    const body = await req.json();
    const parsed = endSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid data' }, { status: 400 });
    }

    const { sessionId, finalTranscript } = parsed.data;

    const session = await prisma.session.findFirst({
      where: { id: sessionId, userId: payload.userId },
      include: { user: true },
    });

    if (!session) {
      return NextResponse.json({ error: 'Session not found' }, { status: 404 });
    }

    await prisma.session.update({
      where: { id: sessionId },
      data: {
        status: 'completed',
        endedAt: new Date(),
        transcript: finalTranscript,
      },
    });

    return NextResponse.json({ success: true, sessionId });
  } catch (error) {
    console.error('End interview error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
