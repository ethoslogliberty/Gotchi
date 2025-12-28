// src/useAmbience.js
import { useRef } from 'react';

export const useAmbience = () => {
  const audioCtx = useRef(null);
  const masterGain = useRef(null);
  const isRunning = useRef(false);

  const startAmbience = () => {
    if (!audioCtx.current) {
      audioCtx.current = new (window.AudioContext || window.webkitAudioContext)();
      masterGain.current = audioCtx.current.createGain();
      masterGain.current.gain.value = 0.05;
      masterGain.current.connect(audioCtx.current.destination);

      const playNote = (freq, delay) => {
        if (!audioCtx.current || audioCtx.current.state === 'closed') return;
        const osc = audioCtx.current.createOscillator();
        const gain = audioCtx.current.createGain();
        osc.type = 'triangle';
        osc.frequency.value = freq;
        gain.gain.setValueAtTime(0, audioCtx.current.currentTime + delay);
        gain.gain.linearRampToValueAtTime(0.1, audioCtx.current.currentTime + delay + 2);
        gain.gain.linearRampToValueAtTime(0, audioCtx.current.currentTime + delay + 6);
        osc.connect(gain);
        gain.connect(masterGain.current);
        osc.start(audioCtx.current.currentTime + delay);
        osc.stop(audioCtx.current.currentTime + delay + 6);
      };

      const loop = () => {
        if (!isRunning.current) return;
        [261.63, 329.63, 392.00, 493.88].forEach((f, i) => playNote(f, i));
        setTimeout(loop, 8000);
      };
      isRunning.current = true;
      loop();
    }
    if (audioCtx.current.state === 'suspended') audioCtx.current.resume();
  };

  const stopAmbience = () => {
    if (audioCtx.current && audioCtx.current.state === 'running') {
      audioCtx.current.suspend();
      isRunning.current = false;
    }
  };

  // IMPORTANTE: Retornar siempre un objeto con ambas funciones
  return { startAmbience, stopAmbience };
};