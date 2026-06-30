import OpenAI from 'openai';

const apiKey = process.env.OPENAI_API_KEY;

if (!apiKey) {
  console.warn('OPENAI_API_KEY is missing. Feedback generation will fail.');
}

export const openai = new OpenAI({ apiKey: apiKey || '' });
