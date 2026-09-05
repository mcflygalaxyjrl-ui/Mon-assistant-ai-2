'use client';
import { useState } from 'react';
import OrionSphere from './components/OrionSphere';

export default function Home() {
  const [view, setView] = useState('orb');
  const [testSpeaking, setTestSpeaking] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  async function sendMessage() {
    if (!input.trim()) return;
    const newMessages = [...messages, { role: 'user', content: input }];
    setMessages(newMessages);
    setInput('');
    setLoading(true);
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages }),
      });
      const data = await res.json();
      setMessages((m) => [...m, { role: 'assistant', content: data.reply }]);
    } catch (e) {
      setMessages((m) => [...m, { role: 'assistant', content: 'Erreur de connexion.' }]);
    }
    setLoading(false);
  }

  if (view === 'orb') {
    return (
      <main style={{ minHeight: '100dvh', background: '#0a0a0f', color: '#e8e8f0', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontFamily: 'system-ui, sans-serif', position: 'relative', padding: '24px' }}>
        <div style={{ position: 'absolute', top: 'max(28px, env(safe-area-inset-top))', left: 0, right: 0, textAlign: 'center', fontSize: '11px', letterSpacing: '0.25em', textTransform: 'uppercase', color: '#6ee7ff', opacity: 0.75, fontWeight: 300 }}>
          Omnipresent Responsive Intelligent Operational Network
        </div>

        <OrionSphere speaking={testSpeaking} size={280} />

        <div style={{ marginTop: '24px', fontSize: '13px', color: '#5a5a6a', textAlign: 'center', minHeight: '20px' }}>
          {testSpeaking ? 'ORION parle (test)...' : 'En attente'}
        </div>

        <button onClick={() => setTestSpeaking((s) => !s)} style={{ marginTop: '16px', background: 'transparent', border: '1px solid #2a2a3a', borderRadius: '20px', padding: '6px 14px', color: '#5a5a6a', fontSize: '11px' }}>
          test pulse (temporaire)
        </button>

        <button onClick={() => setView('chat')} aria-label="Passer en mode texte" style={{ position: 'absolute', bottom: 'max(24px, env(safe-area-inset-bottom))', left: '24px', width: '44px', height: '44px', borderRadius: '50%', background: '#141420', border: '1px solid #2a2a3a', color: '#6ee7ff', fontSize: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          ⌨
        </button>
      </main>
    );
  }

  return (
    <main style={{ minHeight: '100dvh', background: '#0a0a0f', color: '#e8e8f0', display: 'flex', flexDirection: 'column', fontFamily: 'system-ui, sans-serif' }}>
      <div style={{ padding: '16px', paddingTop: 'max(16px, env(safe-area-inset-top))', borderBottom: '1px solid #2a2a3a', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: '13px', color: '#6ee7ff', letterSpacing: '0.05em' }}>● groq online</span>
        <button onClick={() => setView('orb')} aria-label="Revenir au mode sphère" style={{ background: 'transparent', border: 'none', color: '#6ee7ff', fontSize: '18px' }}>◎</button>
      </div>
      <div style={{ flex: 1, overflowY: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {messages.map((m, i) => (
          <div key={i} style={{ alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start', background: m.role === 'user' ? '#1e3a5f' : '#1a1a24', padding: '10px 14px', borderRadius: '12px', maxWidth: '80%', whiteSpace: 'pre-wrap' }}>
            {m.content}
          </div>
        ))}
        {loading && <div style={{ color: '#6ee7ff' }}>...</div>}
      </div>
      <div style={{ display: 'flex', padding: '12px', paddingBottom: 'max(12px, env(safe-area-inset-bottom))', borderTop: '1px solid #2a2a3a', gap: '8px' }}>
        <input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && sendMessage()} style={{ flex: 1, background: '#141420', border: '1px solid #2a2a3a', borderRadius: '8px', padding: '10px', color: '#e8e8f0', fontSize: '16px' }} placeholder="Écris ton message..." />
        <button onClick={sendMessage} style={{ background: '#6ee7ff', border: 'none', borderRadius: '8px', padding: '10px 16px', fontWeight: 'bold' }}>→</button>
      </div>
    </main>
  );
}
