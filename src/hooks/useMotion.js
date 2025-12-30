import { useMemo } from 'react';

export const useMotion = (status) => {
  const animations = useMemo(() => {
    // Definimos la velocidad del cuerpo según el estado
    const isThinking = status === "Reflexionando...";
    const bodyDuration = isThinking ? 3 : 6; // Flota más rápido cuando procesa ideas

    return {
      body: {
        y: [0, -12, 0],
        rotate: isThinking ? [-2, 2, -2] : [-1, 1, -1],
        transition: { 
          duration: bodyDuration, 
          repeat: Infinity, 
          ease: "easeInOut" 
        }
      },

      // PARPADEO "GUMMY": Optimizado para naturalidad
      eyes: {
        scaleY: [1, 1, 0.05, 1.1, 1],
        scaleX: [1, 1, 1.25, 0.95, 1],
        transition: { 
          repeat: Infinity, 
          duration: 7, // Un ciclo ligeramente más corto para que no sea predecible
          times: [0, 0.96, 0.975, 0.985, 1], 
          ease: ["linear", "circIn", "backOut", "easeOut"] 
        }
      },

      tap: {
        scale: 0.85,
        rotate: [0, -5, 5, 0],
        transition: { type: "spring", stiffness: 500, damping: 15 }
      },

      hover: {
        scale: 1.05,
        y: -8,
        transition: { type: "spring", stiffness: 300, damping: 20 }
      },

      spawn: {
        scale: [0, 1.2, 0.9, 1],
        opacity: [0, 1],
        transition: { duration: 1, ease: "backOut" }
      }
    };
  }, [status]);

  return animations;
};