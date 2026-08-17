export async function POST(req) {
  const { messages } = await req.json();
  const apiKey = process.env.GROQ_API_KEY;
    const model = process.env.GROQ_MODEL || 'openai/gpt-oss-120b';

  const systemPrompt = "Tu es l'assistant personnel d'ingénierie de l'utilisateur. Tu réfléchis en profondeur, tu challenges ses idées quand c'est pertinent, tu proposes des pistes concrètes et innovantes pour ses projets techniques. Tu es direct, précis, jamais complaisant. Tu n'es pas un chatbot générique.";

  const chatMessages = [
    { role: 'system', content: systemPrompt },
    ...messages.map((m) => ({ role: m.role, content: m.content })),
  ];

  const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({ model, messages: chatMessages }),
  });

  const data = await res.json();

  if (!data?.choices?.[0]?.message?.content) {
    console.error('GROQ STATUS:', res.status);
    console.error('GROQ BODY:', JSON.stringify(data));
  }

  const reply = data?.choices?.[0]?.message?.content || "Je n'ai pas pu générer de réponse (vérifie la clé API).";

  return Response.json({ reply });
}
