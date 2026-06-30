import { useState, useEffect, useCallback } from 'react';
import { getVapiClient } from '@/lib/vapi';
import { buildInterviewPrompt } from '@/ai/prompts/master';

export const useVapi = () => {
  const [vapi] = useState(() => getVapiClient());
  const [isCallActive, setIsCallActive] = useState(false);
  const [transcript, setTranscript] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    vapi.on('call-start', () => {
      setIsCallActive(true);
      setError(null);
    });
    vapi.on('call-end', () => setIsCallActive(false));
    vapi.on('error', (e: any) => {
      const errMsg = e.message || e.error?.message || '';
      
      // Vapi sometimes throws an ejection error on natural hangup. Treat this as a call-end.
      if (errMsg.toLowerCase().includes('meeting ended') || errMsg.toLowerCase().includes('ejection')) {
        setIsCallActive(false);
        return;
      }
      
      console.error('VAPI error object:', JSON.stringify(e, null, 2));
      console.error('VAPI error:', e);
      setError(errMsg || 'An error occurred during the call.');
    });
    vapi.on('message', (msg: any) => {
      if (msg.type === 'transcript') {
        setTranscript((prev) => {
          const newTranscript = [...prev];
          const lastIdx = newTranscript.length - 1;
          
          if (lastIdx >= 0 && newTranscript[lastIdx].role === msg.role) {
            // Overwrite the current speech block
            newTranscript[lastIdx] = msg;
          } else {
            // Start a new speech block for a new role turn
            newTranscript.push(msg);
          }
          
          return newTranscript;
        });
      }
    });
    return () => {
      vapi.removeAllListeners();
    };
  }, [vapi]);

  const startCall = useCallback(async (jobRole: string, interviewType: string, candidateName: string, experienceLevel: string) => {
    try {
      setError(null);
      
      const systemPrompt = buildInterviewPrompt({
        candidateName,
        jobRole,
        experienceLevel,
        interviewType: interviewType as any
      });

      await vapi.start('cd47e748-3afe-42d6-a33b-275b8252291c', {
        model: {
          provider: 'openai',
          model: 'gpt-4o',
          messages: [{ role: 'system', content: systemPrompt }]
        }
      });
    } catch (e: any) {
      const errMsg = e?.message || e?.error?.message || '';
      if (errMsg.toLowerCase().includes('ejection') || errMsg.toLowerCase().includes('meeting ended')) {
        console.log('Call ended naturally (ejection).');
        return;
      }
      console.error('Failed to start VAPI call', e);
      setError(errMsg || 'Failed to connect to the voice assistant.');
    }
  }, [vapi]);

  const endCall = useCallback(() => {
    try {
      vapi.stop();
    } catch (e: any) {
      console.log('Suppressed vapi.stop error:', e);
    }
  }, [vapi]);

  return { isCallActive, transcript, startCall, endCall, error };
};
