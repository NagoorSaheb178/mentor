import { behavioralPrompt } from '../prompts/behavioral';
import { technicalPrompt } from '../prompts/technical';

export const vapiAssistantConfig = (jobRole: string, interviewType: string): any => {
  const prompt = interviewType === 'technical' ? technicalPrompt(jobRole) : behavioralPrompt(jobRole);
  
  return {
    name: 'AI Interviewer',
    model: {
      provider: 'openai',
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: prompt
        }
      ]
    },
    voice: {
      provider: '11labs',
      voiceId: '21m00Tcm4TlvDq8ikWAM' // Default voice
    }
  };
};
