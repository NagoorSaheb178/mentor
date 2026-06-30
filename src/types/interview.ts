import { InterviewType } from '@/constants/interviewTypes';

export interface TranscriptEntry {
  role: 'ai' | 'candidate';
  content: string;
  timestamp: number;
  questionIndex?: number;
  score?: number;
}

export interface InterviewSession {
  id: string;
  userId: string;
  interviewType: InterviewType;
  status: 'active' | 'completed' | 'abandoned';
  startedAt: string;
  endedAt?: string;
  transcript: TranscriptEntry[];
}

export interface FeedbackData {
  overallScore: number;
  communicationScore: number;
  technicalScore: number;
  problemSolvingScore: number;
  confidenceScore: number;
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
  questionBreakdown: QuestionBreakdown[];
}

export interface QuestionBreakdown {
  question: string;
  answer: string;
  score: number;
  feedback: string;
}
