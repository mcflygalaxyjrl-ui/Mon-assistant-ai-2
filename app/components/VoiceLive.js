'use client';
import { useRef, useState } from 'react';

const SEND_RATE = 16000;
const RECEIVE_RATE = 24000;

function floatTo16BitPCM(float32) {
  const buffer = new ArrayBuffer(float32.length * 2);
  const view = new DataView(buffer);
  for (let i = 0; i < float32.length; i++) {
    const s = Math.max(-1, Math.min(1, float32[i]));
    view.setInt16(i * 2, s < 0 ? s * 0x8000 : s * 0x7fff, true);
  }
  return buffer;
}

function toBase64(buffer) {
  let binary = '';
  const bytes = new Uint8Array(buffer);
  for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]);
  return btoa(binary);
}

function fromBase64Int16(base64) {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return new Int16Array(bytes.buffer);
}

function downsample(buffer, inRate, outRate) {
  if (outRate === inRate) return buffer;
  const ratio = inRate / outRate;
  const newLength = Math.round(buffer.length / ratio);
  const result = new Float32Array(newLength);
  for (let i = 0; i < newLength; i++) result[i] = buffer[Math.floor(i * ratio)];
  return result;
}

export default function VoiceLive({ onSpeakingChange, onCaptionChange }) {
  const [status, setStatus] = useState('idle');
  const [log, setLog] = useState([]);
  const wsRef = useRef(null);
  const micCtxRef = useRef(null);
  const streamRef = useRef(null);
  const processorRef = useRef(null);
  const playCtxRef = useRef(null);
  const playTimeRef = useRef(0);
  const captionRef = useRef('');
  const clearTimerRef = useRef(null);

  function addLog(line) {
    setLog((l) => [...l.slice(-7), line]);
  }

  async function start() {
    setStatus('connecting');
    addLog('démarrage...');

    playCtxRef.current = new (window.AudioContext || window.webkitAudioContext)({ sampleRate: RECEIVE_RATE });

    let tokenData;
    try {
      const tokenRes = await fetch('/api/voice-token');
      tokenData = await tokenRes.json();
    } catch (e) {
      addLog('erreur fetch token: ' + e.message);
      setStatus('error');
      return;
    }

    if (!tokenData.token) {
      addLog('pas de token: ' + JSON.stringify(tokenData));
      setStatus('error');
      return;
    }
    addLog('token obtenu');

    const ws = new WebSocket(
      `wss://generativelanguage.googleapis.com/ws/google.ai.generativelanguage.v1alpha.GenerativeService.BidiGenerateContentConstrained?access_token=${tokenData.token}`
    );
    wsRef.current = ws;

    ws.onopen = async () => {
      addLog('websocket ouvert');
      ws.send(JSON.stringify({ setup: {} }));
      setStatus('listening');
      try {
        await startMic();
        addLog('micro actif');
      } catch (e) {
        addLog('erreur micro: ' + e.message);
        setStatus('error');
      }
    };

    ws.onmessage = async (event) => {
      try {
        const text = typeof event.data === 'string' ? event.data : await event.data.text();
        const msg = JSON.parse(text);
        const parts = msg?.serverContent?.modelTurn?.parts || [];
        for (const part of parts) {
          if (part.inlineData?.data) {
            onSpeakingChange?.(true);
            playChunk(part.inlineData.data);
          }
        }

        const transcriptPiece = msg?.serverContent?.outputTranscription?.text;
        if (transcriptPiece) {
          clearTimeout(clearTimerRef.current);
          captionRef.current += transcriptPiece;
          onCaptionChange?.(captionRef.current);
        }

        if (msg?.serverContent?.turnComplete) {
          onSpeakingChange?.(false);
          clearTimerRef.current = setTimeout(() => {
            captionRef.current = '';
            onCaptionChange?.('');
          }, 1500);
        }

        if (msg?.setupComplete) addLog('setup confirmé par Google');
      } catch (e) {
        addLog('erreur message: ' + e.message);
      }
    };

    ws.onerror = () => addLog('erreur websocket');
    ws.onclose = (e) => {
      addLog('websocket fermé: code ' + e.code + ' ' + (e.reason || ''));
      setStatus('idle');
    };
  }

  async function startMic() {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    streamRef.current = stream;
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    micCtxRef.current = ctx;
    const source = ctx.createMediaStreamSource(stream);
    const processor = ctx.createScriptProcessor(4096, 1, 1);
    processorRef.current = processor;

    processor.onaudioprocess = (e) => {
      if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) return;
      const input = e.inputBuffer.getChannelData(0);
      const down = downsample(input, ctx.sampleRate, SEND_RATE);
      const pcm = floatTo16BitPCM(down);
      wsRef.current.send(JSON.stringify({
        realtimeInput: { mediaChunks: [{ mimeType: `audio/pcm;rate=${SEND_RATE}`, data: toBase64(pcm) }] },
      }));
    };

    source.connect(processor);
    processor.connect(ctx.destination);
  }

  function playChunk(base64) {
    const ctx = playCtxRef.current;
    const int16 = fromBase64Int16(base64);
    const float32 = new Float32Array(int16.length);
    for (let i = 0; i < int16.length; i++) float32[i] = int16[i] / 32768;
    const buffer = ctx.createBuffer(1, float32.length, RECEIVE_RATE);
    buffer.copyToChannel(float32, 0);
    const src = ctx.createBufferSource();
    src.buffer = buffer;
    src.connect(ctx.destination);
    const startAt = Math.max(ctx.currentTime, playTimeRef.current);
    src.start(startAt);
    playTimeRef.current = startAt + buffer.duration;
  }

  function stop() {
    processorRef.current?.disconnect();
    micCtxRef.current?.close();
    streamRef.current?.getTracks().forEach((t) => t.stop());
    wsRef.current?.close();
    setStatus('idle');
    onSpeakingChange?.(false);
    captionRef.current = '';
    onCaptionChange?.('');
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px', width: '100%' }}>
      {status === 'idle' && (
        <button onClick={start} style={{ background: '#6ee7ff', border: 'none', borderRadius: '20px', padding: '10px 20px', fontWeight: 'bold' }}>
          Démarrer la conversation
        </button>
      )}
      {status !== 'idle' && (
        <button onClick={stop} style={{ background: 'transparent', border: '1px solid #2a2a3a', borderRadius: '20px', padding: '8px 16px', color: '#e8e8f0' }}>
          {status === 'connecting' ? 'Connexion...' : 'Raccrocher'}
        </button>
      )}
      <div style={{ fontSize: '10px', color: '#5a5a6a', fontFamily: 'monospace', textAlign: 'left', maxWidth: '90%', maxHeight: '110px', overflowY: 'auto' }}>
        {log.map((line, i) => <div key={i}>{line}</div>)}
      </div>
    </div>
  );
}
