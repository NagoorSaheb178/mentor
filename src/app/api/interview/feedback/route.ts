import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { verifyToken, extractTokenFromHeader } from '@/lib/jwt';

const feedbackSchema = z.object({
  sessionId: z.string(),
  transcript: z.array(z.any()).optional(),
  feedback: z.object({
    overallScore: z.number(),
    communicationScore: z.number(),
    technicalScore: z.number(),
    problemSolvingScore: z.number(),
    confidenceScore: z.number(),
    strengths: z.array(z.string()),
    weaknesses: z.array(z.string()),
    recommendations: z.array(z.string()),
    questionBreakdown: z.array(z.object({
      question: z.string(),
      answer: z.string(),
      score: z.number(),
      feedback: z.string(),
    })),
  }).optional(),
});

export async function POST(req: NextRequest) {
  try {
    const token = extractTokenFromHeader(req.headers.get('authorization'));
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const payload = verifyToken(token);
    const body = await req.json();
    const parsed = feedbackSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid data' }, { status: 400 });
    }

    const { sessionId, feedback, transcript } = parsed.data;

    const session = await prisma.session.findFirst({
      where: { id: sessionId, userId: payload.userId },
    });

    if (!session) {
      return NextResponse.json({ error: 'Session not found' }, { status: 404 });
    }

    let savedFeedback = null;
    if (feedback) {
      savedFeedback = await prisma.feedback.upsert({
        where: { sessionId },
        create: { sessionId, ...feedback },
        update: { ...feedback },
      });
    }

    await prisma.session.update({
      where: { id: sessionId },
      data: { 
        status: 'completed', 
        endedAt: new Date(),
        ...(transcript ? { transcript } : {})
      }
    });

    return NextResponse.json({ feedback: savedFeedback, success: true });
  } catch (error) {
    console.error('Feedback save error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const token = extractTokenFromHeader(req.headers.get('authorization'));
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const payload = verifyToken(token);
    const { searchParams } = new URL(req.url);
    const sessionId = searchParams.get('sessionId');

    if (!sessionId) {
      return NextResponse.json({ error: 'sessionId required' }, { status: 400 });
    }

    const session = await prisma.session.findFirst({
      where: { id: sessionId, userId: payload.userId },
      include: { feedback: true },
    });

    if (!session) {
      return NextResponse.json({ error: 'Session not found' }, { status: 404 });
    }

    return NextResponse.json({ session, feedback: session.feedback });
  } catch (error) {
    console.error('Feedback get error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
