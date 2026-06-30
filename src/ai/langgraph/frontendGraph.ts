import { StateGraph, Annotation } from '@langchain/langgraph';

// Define the State structure that will be passed between nodes
export const FeedbackGraphState = Annotation.Root({
  transcriptText: Annotation<string>(),
  interviewType: Annotation<string>(),
  jobRole: Annotation<string>(),
  
  // Node 1: Communication Output
  communicationScore: Annotation<number>(),
  confidenceScore: Annotation<number>(),
  commStrengths: Annotation<string[]>(),
  commWeaknesses: Annotation<string[]>(),
  
  // Node 2: Technical/Content Output
  technicalScore: Annotation<number>(),
  problemSolvingScore: Annotation<number>(),
  techStrengths: Annotation<string[]>(),
  techWeaknesses: Annotation<string[]>(),
  
  // Node 3: Synthesis Output
  overallScore: Annotation<number>(),
  recommendations: Annotation<string[]>(),
  questionBreakdown: Annotation<any[]>(),
  
  // Final Result
  finalFeedbackJson: Annotation<any>(),
});

// Helper to call Puter.js
const callPuter = async (prompt: string): Promise<string> => {
  // @ts-ignore
  if (!window.puter?.ai?.chat) {
    throw new Error('Puter AI is not available');
  }
  
  // @ts-ignore
  const response = await window.puter.ai.chat(prompt, { model: 'gpt-4o-mini' });
  const resAny = response as any;

  let text = '';
  if (resAny?.message?.content && Array.isArray(resAny.message.content)) {
    text = resAny.message.content[0]?.text || '';
  } else if (resAny?.message?.content) {
    text = resAny.message.content;
  } else if (resAny?.text) {
    text = resAny.text;
  }
  
  return text;
};

// Node 1: Evaluate Communication & Confidence
const evaluateCommunicationNode = async (state: typeof FeedbackGraphState.State) => {
  const prompt = `You are an expert communication coach. Evaluate the following transcript of a ${state.interviewType} interview for a ${state.jobRole} role.
Focus ONLY on communication skills, clarity, and confidence.

TRANSCRIPT:
${state.transcriptText}

Provide your analysis as a JSON object with this EXACT structure (no markdown, pure JSON):
{
  "communicationScore": <number 0-100>,
  "confidenceScore": <number 0-100>,
  "strengths": ["<strength 1>", "<strength 2>"],
  "weaknesses": ["<weakness 1>", "<weakness 2>"]
}`;

  const responseText = await callPuter(prompt);
  const jsonStr = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
  const data = JSON.parse(jsonStr.match(/\{[\s\S]*\}/)?.[0] || '{}');

  return {
    communicationScore: data.communicationScore || 0,
    confidenceScore: data.confidenceScore || 0,
    commStrengths: data.strengths || [],
    commWeaknesses: data.weaknesses || []
  };
};

// Node 2: Evaluate Technical & Problem Solving
const evaluateTechnicalNode = async (state: typeof FeedbackGraphState.State) => {
  const prompt = `You are an expert technical interviewer. Evaluate the following transcript of a ${state.interviewType} interview for a ${state.jobRole} role.
Focus ONLY on technical depth, problem-solving abilities, and domain knowledge.

TRANSCRIPT:
${state.transcriptText}

Provide your analysis as a JSON object with this EXACT structure (no markdown, pure JSON):
{
  "technicalScore": <number 0-100>,
  "problemSolvingScore": <number 0-100>,
  "strengths": ["<strength 1>", "<strength 2>"],
  "weaknesses": ["<weakness 1>", "<weakness 2>"]
}`;

  const responseText = await callPuter(prompt);
  const jsonStr = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
  const data = JSON.parse(jsonStr.match(/\{[\s\S]*\}/)?.[0] || '{}');

  return {
    technicalScore: data.technicalScore || 0,
    problemSolvingScore: data.problemSolvingScore || 0,
    techStrengths: data.strengths || [],
    techWeaknesses: data.weaknesses || []
  };
};

// Node 3: Synthesize Final Feedback
const synthesizeNode = async (state: typeof FeedbackGraphState.State) => {
  const prompt = `You are the lead interviewer. Review the transcript and synthesize the final feedback.
  
TRANSCRIPT:
${state.transcriptText}

We already evaluated scores:
Communication: ${state.communicationScore}
Confidence: ${state.confidenceScore}
Technical: ${state.technicalScore}
Problem Solving: ${state.problemSolvingScore}

Provide a JSON object with:
1. "overallScore" (average of the above 4)
2. "recommendations" (3 actionable tips based on the transcript)
3. "questionBreakdown": Array of { "question", "answer", "score" (0-10), "feedback" }

EXACT JSON STRUCTURE (no markdown):
{
  "overallScore": <number 0-100>,
  "recommendations": ["<rec 1>", "<rec 2>", "<rec 3>"],
  "questionBreakdown": [
    {
      "question": "...",
      "answer": "...",
      "score": 8,
      "feedback": "..."
    }
  ]
}`;

  const responseText = await callPuter(prompt);
  const jsonStr = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
  const data = JSON.parse(jsonStr.match(/\{[\s\S]*\}/)?.[0] || '{}');
  
  // Build final merged JSON
  const finalFeedbackJson = {
    overallScore: data.overallScore || 0,
    communicationScore: state.communicationScore,
    technicalScore: state.technicalScore,
    problemSolvingScore: state.problemSolvingScore,
    confidenceScore: state.confidenceScore,
    strengths: [...(state.commStrengths || []), ...(state.techStrengths || [])],
    weaknesses: [...(state.commWeaknesses || []), ...(state.techWeaknesses || [])],
    recommendations: data.recommendations || [],
    questionBreakdown: data.questionBreakdown || []
  };

  return {
    overallScore: finalFeedbackJson.overallScore,
    recommendations: finalFeedbackJson.recommendations,
    questionBreakdown: finalFeedbackJson.questionBreakdown,
    finalFeedbackJson
  };
};

// Build the LangGraph
export const createFeedbackGraph = () => {
  const workflow = new StateGraph(FeedbackGraphState)
    .addNode('evaluateCommunication', evaluateCommunicationNode)
    .addNode('evaluateTechnical', evaluateTechnicalNode)
    .addNode('synthesize', synthesizeNode)
    
    // Wire them up sequentially (Puter free tier might rate limit parallel calls)
    .addEdge('__start__', 'evaluateCommunication')
    .addEdge('evaluateCommunication', 'evaluateTechnical')
    .addEdge('evaluateTechnical', 'synthesize')
    .addEdge('synthesize', '__end__');

  return workflow.compile();
};
