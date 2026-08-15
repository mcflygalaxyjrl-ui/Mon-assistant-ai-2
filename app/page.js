'use client';
import { useState } from 'react';

export default function Home() {
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

  return (
    <main style={{ minHeight: '100vh', background: '#0a0a0f', color: '#e8e8f0', display: 'flex', flexDirection: 'column', fontFamily: 'system-ui, sans-serif' }}>
      <div style={{ padding: '16px', borderBottom: '1px solid #2a2a3a', fontSize: '13px', color: '#6ee7ff', letterSpacing: '0.05em' }}>
        ● gemini online
      </div>
      <div style={{ flex: 1, overflowY: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {messages.map((m, i) => (
          <div key={i} style={{
            alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start',
            background: m.role === 'user' ? '#1e3a5f' : '#1a1a24',
            padding: '10px 14px',
            borderRadius: '12px',
            maxWidth: '80%',
            whiteSpace: 'pre-wrap',
          }}>
            {m.content}
          </div>
        ))}
        {loading && <div style={{ color: '#6ee7ff' }}>...</div>}
      </div>
      <div style={{ display: 'flex', padding: '12px', borderTop: '1px solid #2a2a3a', gap: '8px' }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
          style={{ flex: 1, background: '#141420', border: '1px solid #2a2a3a', borderRadius: '8px', padding: '10px', color: '#e8e8f0' }}
          placeholder="Écris ton message..."
        />
        <button onClick={sendMessage} style={{ background: '#6ee7ff', border: 'none', borderRadius: '8px', padding: '10px 16px', fontWeight: 'bold' }}>
          →
        </button>
      </div>
    </main>
  );
}
