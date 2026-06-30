import { prisma } from '@/lib/prisma';
import { openai } from '@/lib/openai';
import { buildFeedbackPrompt } from '@/ai/prompts/system'; // Re-use the existing prompt generator if possible, or implement a local one.

export const feedbackService = {
  async generateAndSaveFeedback(sessionId: string, transcript: any[], jobRole: string, interviewType: string) {
    if (!transcript || transcript.length < 2) {
      throw new Error('Transcript too short to generate meaningful feedback.');
    }

    const transcriptText = transcript.map(t => `${t.role === 'assistant' ? 'Interviewer' : 'Candidate'}: ${t.transcript || t.text}`).join('\n');

    const prompt = `You are an expert interview coach. Analyze this ${interviewType} interview transcript for a ${jobRole} candidate and provide detailed, actionable feedback.

TRANSCRIPT:
${transcriptText}

Provide your analysis as a JSON object with this EXACT structure (no markdown, pure JSON):
{
  "overallScore": <number 0-100>,
  "communicationScore": <number 0-100>,
  "technicalScore": <number 0-100>,
  "problemSolvingScore": <number 0-100>,
  "confidenceScore": <number 0-100>,
  "strengths": ["<strength 1>", "<strength 2>"],
  "weaknesses": ["<weakness 1>", "<weakness 2>"],
  "recommendations": ["<recommendation 1>", "<recommendation 2>"],
  "questionBreakdown": [
    {
      "question": "<the interviewer's question>",
      "answer": "<summary of candidate's answer>",
      "score": <number 0-10>,
      "feedback": "<specific feedback on this answer>"
    }
  ]
}

CRITICAL: Return ONLY valid JSON. Do not wrap it in \`\`\`json blocks.`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      response_format: { type: 'json_object' }
    });

    const jsonStr = completion.choices[0].message.content || '{}';
    const feedbackData = JSON.parse(jsonStr);

    // Update Session status and save feedback
    await prisma.session.update({
      where: { id: sessionId },
      data: { status: 'completed' }
    });

    const savedFeedback = await prisma.feedback.upsert({
      where: { sessionId },
      create: { sessionId, ...feedbackData },
      update: { ...feedbackData },
    });

    return savedFeedback;
  }
};
