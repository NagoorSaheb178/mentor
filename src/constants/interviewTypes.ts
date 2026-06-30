export type InterviewType = 'behavioral' | 'technical' | 'systemDesign' | 'hr';

export const INTERVIEW_TYPES = {
  behavioral: {
    id: 'behavioral',
    label: 'Behavioral',
    description: 'Communication, STAR structure, self-awareness',
    icon: '🧠',
    color: '#6366f1',
    duration: '20-30 min',
  },
  technical: {
    id: 'technical',
    label: 'Technical',
    description: 'Depth of knowledge, problem-solving approach',
    icon: '⚙️',
    color: '#0ea5e9',
    duration: '25-35 min',
  },
  systemDesign: {
    id: 'systemDesign',
    label: 'System Design',
    description: 'Architecture thinking, tradeoffs, complexity',
    icon: '🏗️',
    color: '#8b5cf6',
    duration: '30-40 min',
  },
  hr: {
    id: 'hr',
    label: 'HR / Culture Fit',
    description: 'Motivation, values, situational judgment',
    icon: '🤝',
    color: '#10b981',
    duration: '15-25 min',
  },
} as const;

export const EXPERIENCE_LEVELS = [
  { value: 'intern', label: 'Intern / Student' },
  { value: 'junior', label: 'Junior (0–2 years)' },
  { value: 'mid', label: 'Mid-level (2–5 years)' },
  { value: 'senior', label: 'Senior (5–10 years)' },
  { value: 'staff', label: 'Staff / Principal (10+ years)' },
];
