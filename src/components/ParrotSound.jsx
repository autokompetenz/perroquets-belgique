import { useState, useEffect, useRef } from 'react';
import { useThemeStore } from '../store';

const SOUND_URL = 'https://www.soundjay.com/misc/whistle-1.mp3';

export default function ParrotSound() {
  const { theme } = useThemeStore();
  const [enabled, setEnabled] = useState(() => localStorage.getItem('prq_sound') !== 'off');
  const [played, setPlayed] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    if (!enabled) return;
    const audio = new Audio(SOUND_URL);
    audio.volume = 1.0;
    audioRef.current = audio;

    const play = () => {
      if (!played) {
        audio.play().catch(() => {});
        setPlayed(true);
      }
    };

    document.addEventListener('click', play, { once: true });
    audio.play().catch(() => {});
    return () => {
      document.removeEventListener('click', play);
      audio.pause();
      audio.src = '';
    };
  }, [enabled]);

  const toggle = () => {
    const next = !enabled;
    setEnabled(next);
    localStorage.setItem('prq_sound', next ? 'on' : 'off');
    if (next) {
      const a = new Audio(SOUND_URL);
      a.volume = 1.0;
      a.play().catch(() => {});
    }
  };

  const isDark = theme === 'dark';

  return (
    <button
      onClick={toggle}
      title={enabled ? 'Désactiver le son' : 'Activer le son'}
      style={{
        position: 'fixed', bottom: 94, right: 14, zIndex: 997,
        width: 40, height: 40, borderRadius: 10,
        background: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)',
        border: `1px solid ${isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.1)'}`,
        cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 18, transition: 'all 0.2s',
        backdropFilter: 'blur(12px)',
      }}
      onMouseOver={e => { e.currentTarget.style.background = isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.1)'; }}
      onMouseOut={e => { e.currentTarget.style.background = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)'; }}
    >
      {enabled ? '🔊' : '🔇'}
    </button>
  );
}
