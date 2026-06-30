import Vapi from '@vapi-ai/web';

export const getVapiClient = () => {
  const publicKey = process.env.NEXT_PUBLIC_VAPI_PUBLIC_KEY;
  if (!publicKey) {
    console.warn('VAPI public key is missing. Voice AI will not function.');
  }
  return new Vapi(publicKey || '');
};
