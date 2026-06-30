'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { TranscriptEntry } from '@/types/interview';
import { InterviewType } from '@/constants/interviewTypes';
import { buildSystemPrompt, buildFeedbackPrompt } from '@/ai/prompts/system';

declare global {
  interface Window {
    puter: {
      ai: {
        chat: (
          messages: Array<{ role: string; content: string }> | string,
          options?: {
            model?: string;
            stream?: boolean;
            system?: string;
          }
        ) => Promise<AsyncIterable<{ text: string }> | { message: { content: [{ text: string }] } }>;
        txt2speech: (
          text: string,
          options?: {
            provider?: 'openai' | 'aws-polly' | 'elevenlabs' | 'gemini' | 'xai';
            model?: string;
            voice?: string;
            engine?: string;
            language?: string;
            test_mode?: boolean;
          }
        ) => Promise<HTMLAudioElement>;
        speech2txt: (
          audio: Blob,
          options?: { model?: string }
        ) => Promise<{ text: string }>;
      };
      auth: {
        isSignedIn: () => Promise<boolean>;
        signIn: () => Promise<void>;
        getUser: () => Promise<{ username: string }>;
      };
    };
  }
}

export type InterviewStage = 'idle' | 'ai-speaking' | 'listening' | 'processing' | 'completed';
export type TTSMode = 'puter' | 'browser';
export type PuterAuthState = 'checking' | 'authenticated' | 'unauthenticated' | 'error';

interface UseInterviewOptions {
  sessionId: string;
  interviewType: InterviewType;
  jobRole: string;
  experienceLevel: string;
  candidateName: string;
  authToken: string;
}

export function useInterview({
  sessionId,
  interviewType,
  jobRole,
  experienceLevel,
  candidateName,
  authToken,
}: UseInterviewOptions) {
  const [stage, setStage] = useState<InterviewStage>('idle');
  const [transcript, setTranscript] = useState<TranscriptEntry[]>([]);
  const [currentAIText, setCurrentAIText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isGeneratingFeedback, setIsGeneratingFeedback] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [ttsMode, setTtsMode] = useState<TTSMode>('browser');
  const [puterAuthState, setPuterAuthState] = useState<PuterAuthState>('checking');

  const conversationHistory = useRef<Array<{ role: string; content: string }>>([]);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  const startTimeRef = useRef<number>(Date.now());
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const currentAudioRef = useRef<HTMLAudioElement | null>(null);
  const systemPromptRef = useRef<string>('');

  // Build system prompt once
  useEffect(() => {
    systemPromptRef.current = buildSystemPrompt({
      interviewType,
      jobRole,
      experienceLevel,
      candidateName,
    });
  }, [interviewType, jobRole, experienceLevel, candidateName]);

  // Elapsed timer
  useEffect(() => {
    if (stage !== 'idle' && stage !== 'completed') {
      timerRef.current = setInterval(() => {
        setElapsedSeconds(Math.floor((Date.now() - startTimeRef.current) / 1000));
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [stage]);

  // ─── Probe Puter auth once on mount ───────────────────────────────────────
  useEffect(() => {
    const checkPuterAuth = async () => {
      // Wait up to 3s for puter.js to load
      let attempts = 0;
      while (typeof window.puter === 'undefined' && attempts < 15) {
        await new Promise(r => setTimeout(r, 200));
        attempts++;
      }

      if (typeof window.puter === 'undefined') {
        setPuterAuthState('error');
        setTtsMode('browser');
        return;
      }

      try {
        const signedIn = await window.puter.auth.isSignedIn();
        if (signedIn) {
          setPuterAuthState('authenticated');
          setTtsMode('puter');
        } else {
          setPuterAuthState('unauthenticated');
          setTtsMode('browser');
        }
      } catch {
        setPuterAuthState('error');
        setTtsMode('browser');
      }
    };

    checkPuterAuth();
  }, []);

  // ─── Sign in to Puter explicitly ─────────────────────────────────────────
  const signInToPuter = useCallback(async () => {
    setPuterAuthState('checking');
    try {
      await window.puter.auth.signIn();
      const signedIn = await window.puter.auth.isSignedIn();
      if (signedIn) {
        setPuterAuthState('authenticated');
        setTtsMode('puter');
        return true;
      }
    } catch (err) {
      console.error('Puter sign-in failed:', err);
    }
    setPuterAuthState('unauthenticated');
    setTtsMode('browser');
    return false;
  }, []);

  const saveTranscriptEntry = useCallback(async (entry: TranscriptEntry) => {
    try {
      await fetch('/api/interview/transcript', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({ sessionId, entry }),
      });
    } catch (e) {
      console.error('Failed to save transcript entry:', e);
    }
  }, [sessionId, authToken]);

  // ─── Browser SpeechSynthesis helper ──────────────────────────────────────
  const speakWithBrowser = useCallback((text: string): Promise<void> => {
    return new Promise<void>((resolve) => {
      if (typeof window === 'undefined' || !window.speechSynthesis) {
        setTimeout(resolve, 2500);
        return;
      }
      // Cancel any ongoing speech
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.92;
      utterance.pitch = 1.0;
      // Pick a natural voice if available
      const voices = window.speechSynthesis.getVoices();
      const preferred = voices.find(v => v.lang === 'en-US' && v.name.includes('Google'))
        || voices.find(v => v.lang.startsWith('en') && !v.name.includes('Zira'))
        || voices[0];
      if (preferred) utterance.voice = preferred;
      utterance.onend = () => resolve();
      utterance.onerror = () => resolve();
      window.speechSynthesis.speak(utterance);
    });
  }, []);

  // ─── TTS — tries Puter first (if authed), falls back to browser ───────────
  const speakAIResponse = useCallback(async (text: string) => {
    setStage('ai-speaking');
    setCurrentAIText(text);

    // Stop any currently playing audio
    if (currentAudioRef.current) {
      currentAudioRef.current.pause();
      currentAudioRef.current = null;
    }
    window.speechSynthesis?.cancel();

    // Puter TTS has a 3000-char limit
    const safeText = text.length > 2900 ? text.slice(0, 2900) + '...' : text;

    const playHTMLAudio = (audio: HTMLAudioElement): Promise<void> =>
      new Promise<void>((resolve) => {
        currentAudioRef.current = audio;
        audio.addEventListener('ended', () => { currentAudioRef.current = null; resolve(); });
        audio.addEventListener('error', () => { currentAudioRef.current = null; resolve(); });
        audio.play().catch(() => resolve());
      });

    if (ttsMode === 'puter') {
      // Try OpenAI TTS via Puter
      try {
        const audio = await window.puter.ai.txt2speech(safeText, {
          provider: 'openai',
          voice: 'nova',
        });
        await playHTMLAudio(audio);
        return;
      } catch (err) {
        console.warn('Puter TTS unavailable, switching to browser TTS for this session:', err);
        // Downgrade for the rest of the session so we stop hammering Puter
        setTtsMode('browser');
      }
    }

    // Browser SpeechSynthesis (always works, no auth, no cost)
    await speakWithBrowser(safeText);
  }, [ttsMode, speakWithBrowser]);

  // ─── AI chat via Puter ────────────────────────────────────────────────────
  const getAIResponse = useCallback(async (userMessage?: string): Promise<string> => {
    if (userMessage) {
      conversationHistory.current.push({ role: 'user', content: userMessage });
    } else if (conversationHistory.current.length === 0) {
      // Puter/OpenAI APIs will throw an error if the messages array is completely empty, 
      // or if it doesn't start with a user message.
      conversationHistory.current.push({ 
        role: 'user', 
        content: 'Hello, please start the interview by introducing yourself.' 
      });
    }

    let fullResponse = '';

    try {
      // Puter handles system prompts more reliably if they are the first message in the array.
      // We also omit the model string to let Puter use its default optimal model, avoiding naming mismatches.
      const messagesToPass = [
        { role: 'system', content: systemPromptRef.current },
        ...conversationHistory.current
      ];

      const response = await window.puter.ai.chat(
        messagesToPass,
        {
          stream: true,
        }
      );

      if (response && Symbol.asyncIterator in (response as object)) {
        const stream = response as AsyncIterable<{ text: string }>;
        for await (const part of stream) {
          if (part?.text) {
            fullResponse += part.text;
            setCurrentAIText(fullResponse);
          }
        }
      } else {
        const r = response as { message: { content: [{ text: string }] } };
        fullResponse = r.message.content[0].text;
      }
    } catch (err) {
      console.error('AI chat error:', err);
      fullResponse = "I'm sorry, I had a moment there. Could you tell me more about your most recent role and what you worked on?";
    }

    conversationHistory.current.push({ role: 'assistant', content: fullResponse });
    return fullResponse;
  }, []);

  // ─── Microphone recording ─────────────────────────────────────────────────
  const startRecording = useCallback(async () => {
    if (isRecording) return;

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const mimeType = MediaRecorder.isTypeSupported('audio/webm;codecs=opus')
        ? 'audio/webm;codecs=opus'
        : MediaRecorder.isTypeSupported('audio/webm')
        ? 'audio/webm'
        : 'audio/mp4';

      const recorder = new MediaRecorder(stream, { mimeType });
      mediaRecorderRef.current = recorder;
      audioChunksRef.current = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data);
      };

      recorder.start(100);
      setIsRecording(true);
      setStage('listening');
    } catch (err) {
      console.error('Microphone error:', err);
      setError('Microphone access denied. Please allow microphone access and refresh.');
    }
  }, [isRecording]);

  const stopRecordingAndProcess = useCallback(async () => {
    if (!isRecording || !mediaRecorderRef.current) return;

    setIsRecording(false);
    setStage('processing');

    const recorder = mediaRecorderRef.current;
    mediaRecorderRef.current = null;

    if (recorder.state !== 'inactive') {
      await new Promise<void>((resolve) => {
        recorder.onstop = () => resolve();
        recorder.stop();
      });
    }

    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }

    if (audioChunksRef.current.length === 0) {
      setStage('listening');
      return;
    }

    const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
    audioChunksRef.current = [];
    
    // Convert to a File object as many APIs require a filename with extension
    const audioFile = new File([audioBlob], 'speech.webm', { type: 'audio/webm' });

    try {
      // Transcribe via Puter Whisper (using default model to prevent hanging)
      const transcription = await window.puter.ai.speech2txt(audioFile);

      const candidateText = transcription.text?.trim();

      if (!candidateText || candidateText.length < 3) {
        setStage('listening');
        return;
      }

      const candidateEntry: TranscriptEntry = {
        role: 'candidate',
        content: candidateText,
        timestamp: Date.now(),
      };
      setTranscript((prev) => [...prev, candidateEntry]);
      await saveTranscriptEntry(candidateEntry);

      const aiText = await getAIResponse(candidateText);

      const aiEntry: TranscriptEntry = {
        role: 'ai',
        content: aiText,
        timestamp: Date.now(),
      };
      setTranscript((prev) => [...prev, aiEntry]);
      await saveTranscriptEntry(aiEntry);

      const closingPhrases = ['wrap up', 'great speaking with you', 'thank you for your time', 'that concludes'];
      const isClosing = closingPhrases.some((p) => aiText.toLowerCase().includes(p));

      if (isClosing) {
        await speakAIResponse(aiText);
        setStage('completed');
        return;
      }

      await speakAIResponse(aiText);
      setStage('listening');
    } catch (err) {
      console.error('Processing error:', err);
      setError('Failed to process audio. Please try again.');
      setStage('listening');
    }
  }, [isRecording, getAIResponse, speakAIResponse, saveTranscriptEntry]);

  const startInterview = useCallback(async () => {
    setError(null);
    setStage('processing');
    startTimeRef.current = Date.now();
    conversationHistory.current = [];

    // Prime the audio system synchronously on user click to unlock autoplay policy
    if (typeof window !== 'undefined') {
      window.speechSynthesis?.resume();
      const silent = new SpeechSynthesisUtterance('');
      silent.volume = 0;
      window.speechSynthesis?.speak(silent);
    }

    const openingText = await getAIResponse();

    const aiEntry: TranscriptEntry = {
      role: 'ai',
      content: openingText,
      timestamp: Date.now(),
    };
    setTranscript([aiEntry]);
    await saveTranscriptEntry(aiEntry);

    await speakAIResponse(openingText);
    setStage('listening');
  }, [getAIResponse, speakAIResponse, saveTranscriptEntry]);

  const endInterview = useCallback(async () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
    }
    if (currentAudioRef.current) {
      currentAudioRef.current.pause();
    }
    window.speechSynthesis?.cancel();

    setIsGeneratingFeedback(true);

    try {
      await fetch('/api/interview/end', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          sessionId,
          finalTranscript: transcript,
        }),
      });

      const feedbackPrompt = buildFeedbackPrompt(
        conversationHistory.current,
        jobRole,
        interviewType
      );

      const feedbackResponse = await window.puter.ai.chat(feedbackPrompt);

      let feedbackText = '';
      if (typeof feedbackResponse === 'string') {
        feedbackText = feedbackResponse;
      } else if (feedbackResponse && typeof feedbackResponse === 'object') {
        if (Symbol.asyncIterator in feedbackResponse) {
          const stream = feedbackResponse as AsyncIterable<{ text?: string }>;
          for await (const part of stream) {
            feedbackText += part?.text || '';
          }
        } else if ('message' in feedbackResponse) {
          const r = feedbackResponse as any;
          feedbackText = r.message?.content?.[0]?.text || '';
        } else if ('text' in feedbackResponse) {
          feedbackText = (feedbackResponse as any).text || '';
        }
      }
      
      feedbackText = feedbackText || '';

      // Robust JSON extraction (handles if Claude wraps in ```json)
      const jsonStr = feedbackText.replace(/```json/g, '').replace(/```/g, '').trim();
      const jsonMatch = jsonStr.match(/\{[\s\S]*\}/);
      
      if (jsonMatch) {
        const feedbackData = JSON.parse(jsonMatch[0]);

        await fetch('/api/interview/feedback', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${authToken}`,
          },
          body: JSON.stringify({ sessionId, feedback: feedbackData }),
        });
      } else {
        console.error('Could not parse feedback JSON:', feedbackText);
      }
    } catch (err) {
      console.error('End interview error:', err);
    } finally {
      setIsGeneratingFeedback(false);
      setStage('completed');
    }
  }, [sessionId, authToken, transcript, jobRole, interviewType, isRecording]);

  return {
    stage,
    transcript,
    currentAIText,
    isRecording,
    error,
    isGeneratingFeedback,
    elapsedSeconds,
    ttsMode,
    puterAuthState,
    signInToPuter,
    startInterview,
    startRecording,
    stopRecordingAndProcess,
    endInterview,
  };
}
