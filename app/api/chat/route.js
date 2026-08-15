export async function POST(req) {
  const { messages } = await req.json();
  const apiKey = process.env.GEMINI_API_KEY;
  const model = process.env.GEMINI_MODEL || 'gemini-2.5-flash';

  const systemPrompt = "Tu es l'assistant personnel d'ingénierie de l'utilisateur. Tu réfléchis en profondeur, tu challenges ses idées quand c'est pertinent, tu proposes des pistes concrètes et innovantes pour ses projets techniques. Tu es direct, précis, jamais complaisant. Tu n'es pas un chatbot générique.";

  const contents = messages.map((m) => ({
    role: m.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: m.content }],
  }));

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: systemPrompt }] },
        contents,
      }),
    }
  );

  const data = await res.json();
  const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text || "Je n'ai pas pu générer de réponse (vérifie la clé API et le nom du modèle).";

  return Response.json({ reply });
}
