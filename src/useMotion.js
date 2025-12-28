// src/useMotion.js
import { useMemo } from 'react';

export const useMotion = (status) => {
  const animations = useMemo(() => ({
    body: {
      y: [0, -12, 0],
      rotate: [-1, 1, -1],
      transition: { duration: 6, repeat: Infinity, ease: "easeInOut" }
    },

    // PARPADEO "GUMMY": Corregido para estabilidad infinita
 eyes: {
  scaleY: [1, 1, 0.05, 1.1, 1], // Inicia en 1, termina en 1
  scaleX: [1, 1, 1.25, 0.95, 1], // Inicia en 1, termina en 1
  transition: { 
    repeat: Infinity, 
    dur: 8, 
    times: [0, 0.96, 0.975, 0.985, 1], 
    ease: ["linear", "circIn", "backOut", "easeOut"] 
  }
},

    tap: {
      scale: 0.85,
      transition: { type: "spring", stiffness: 400, damping: 12 }
    },

    hover: {
      scale: 1.05,
      y: -5,
      transition: { type: "spring", stiffness: 300, damping: 20 }
    },

    spawn: {
      scale: [0, 1.1, 1],
      opacity: [0, 1],
      transition: { duration: 0.8, ease: "backOut" }
    }
  }), [status]);

  return animations;
};