export const dynamic = 'force-dynamic';
import { GoogleGenAI } from '@google/genai';

export async function GET() {
  try {
    const ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: { apiVersion: 'v1alpha' },
    });

    const model = process.env.GEMINI_LIVE_MODEL || 'gemini-2.5-flash-native-audio-preview-12-2025';

    const token = await ai.authTokens.create({
      config: {
        uses: 1,
        expireTime: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
        liveConnectConstraints: {
          model,
          config: {
            responseModalities: ['AUDIO'],
            outputAudioTranscription: {},
            inputAudioTranscription: {},
            speechConfig: {
              voiceConfig: {
                prebuiltVoiceConfig: { voiceName: 'Charon' },
              },
            },
          },
        },
        httpOptions: { apiVersion: 'v1alpha' },
      },
    });

    return Response.json({ token: token.name });
  } catch (err) {
    console.error('TOKEN ERROR:', err?.message || String(err));
    return Response.json({ error: 'token_failed', detail: err?.message || String(err) }, { status: 500 });
  }
}
