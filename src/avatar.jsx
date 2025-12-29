// src/avatar.jsx - VERSIÓN FINAL PERFECTA
import { motion, useSpring } from 'framer-motion'
import { useState, useEffect, memo } from 'react'

const Ojo = memo(({ cx, cy, springX, springY, blink, isThinking }) => (
  <motion.g 
    animate={{ scaleY: blink ? 0.05 : (isThinking ? 0.6 : 1) }}
    transition={{ type: "spring", stiffness: 500, damping: 30 }}
    style={{ originX: `${cx}%`, originY: `${cy}%` }}
  >
    <circle cx={cx} cy={cy} r="5.5" fill="white" />
    <motion.circle 
      cx={cx} cy={cy} r="2.5" fill="black"
      style={{ x: springX, y: springY }} 
    />
  </motion.g>
));

export const Avatar = ({ color, mouse, animations, bocaScale = 0, onClick, isSpeaking, status }) => {
  const [blink, setBlink] = useState(false);
  const springConfig = { stiffness: 80, damping: 20, mass: 1 }; // Más pesado, más fluido
  const springX = useSpring(0, springConfig);
  const springY = useSpring(0, springConfig);

  useEffect(() => {
    springX.set(mouse.x * 10); // Más rango de movimiento
    springY.set(mouse.y * 10);
  }, [mouse.x, mouse.y, springX, springY]);

  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setBlink(true);
      setTimeout(() => setBlink(false), 80);
    }, Math.random() * 3000 + 4000);
    return () => clearInterval(blinkInterval);
  }, []);

  const isThinking = status?.includes("Reflexionando");

  return (
    <motion.div onClick={onClick} style={{ cursor: 'pointer', position: 'relative' }}>
      <svg width="300" height="300" viewBox="0 0 100 100" style={{ overflow: 'visible' }}>
        <defs>
          {/* FILTRO GOOEY PROFESIONAL REFORZADO */}
          <filter id="final-gooey">
            <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur" />
            <feColorMatrix in="blur" mode="matrix" 
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 25 -12" result="goo" />
          </filter>
          {/* DEGRADADO PARA DAR VOLUMEN */}
          <radialGradient id="bodyGradient" cx="50%" cy="40%" r="50%">
            <stop offset="0%" stopColor="#60a5fa" />
            <stop offset="100%" stopColor={color} />
          </radialGradient>
        </defs>

        {/* CUERPO - Ahora es una masa única fusionada */}
        <g style={{ filter: 'url(#final-gooey)' }}>
          <motion.circle
            cx="50" cy="50" fill="url(#bodyGradient)"
            animate={{ 
              r: isSpeaking ? [28, 32, 28] : [27, 28, 27],
              scaleX: isSpeaking ? [1, 1.08, 1] : 1
            }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          {/* Partes que se fusionan con el centro según el mouse */}
          <motion.circle cx="35" cy="50" r="18" fill="url(#bodyGradient)" style={{ x: springX, y: springY }} />
          <motion.circle cx="65" cy="50" r="18" fill="url(#bodyGradient)" style={{ x: springX, y: springY }} />
          <motion.circle cx="50" cy="35" r="15" fill="url(#bodyGradient)" style={{ y: springY }} />
        </g>

        {/* ROSTRO - Limpio y centrado */}
        <g pointerEvents="none">
          <Ojo cx={42} cy={46} springX={springX} springY={springY} blink={blink} isThinking={isThinking} />
          <Ojo cx={58} cy={46} springX={springX} springY={springY} blink={blink} isThinking={isThinking} />

          <motion.g transform="translate(50, 68)">
            <motion.ellipse
              cx="0" cy="0" rx="6"
              animate={{ ry: isSpeaking ? Math.max(1, bocaScale * 9) : 0 }}
              fill="#220000"
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            />
            {!isSpeaking && (
              <path d="M -4 0 Q 0 2 4 0" fill="none" stroke="#000" strokeWidth="1.5" opacity="0.4" />
            )}
          </motion.g>
        </g>
      </svg>
    </motion.div>
  );
};