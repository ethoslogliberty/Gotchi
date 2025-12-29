// src/avatar.jsx
import { motion, useSpring } from 'framer-motion'
import { useState, useEffect, memo } from 'react'

const Ojo = memo(({ cx, cy, springX, springY, blink, isThinking }) => (
  <motion.g 
    animate={{ scaleY: blink ? 0.05 : (isThinking ? 0.6 : 1) }}
    transition={{ type: "spring", stiffness: 500, damping: 30 }}
    style={{ originX: `${cx}%`, originY: `${cy}%` }}
  >
    <circle cx={cx} cy={cy} r="6" fill="white" />
    <motion.circle 
      cx={cx} cy={cy} r="2.8" fill="black"
      style={{ x: springX, y: springY }} 
    />
  </motion.g>
));

export const Avatar = ({ color, mouse, animations, bocaScale = 0, onClick, isSpeaking, status }) => {
  const [blink, setBlink] = useState(false);

  const springConfig = { stiffness: 100, damping: 25, mass: 0.5 };
  const springX = useSpring(0, springConfig);
  const springY = useSpring(0, springConfig);

  useEffect(() => {
    springX.set(mouse.x * 0.8);
    springY.set(mouse.y * 0.8);
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
    <motion.div 
      onClick={onClick}
      style={{ cursor: 'pointer', position: 'relative' }}
      whileTap={{ scale: 0.92 }}
    >
      <svg width="280" height="280" viewBox="0 0 100 100" style={{ overflow: 'visible' }}>
        <defs>
          <filter id="azulito-fluid-filter">
            <feGaussianBlur in="SourceGraphic" stdDeviation="3.5" result="blur" />
            <feColorMatrix in="blur" mode="matrix" 
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 20 -10" result="goo" />
            <feComposite in="SourceGraphic" in2="goo" operator="atop" />
          </filter>
        </defs>

        {/* CUERPO LÍQUIDO */}
        <g style={{ filter: 'url(#azulito-fluid-filter)' }} fill={color}>
          <motion.circle
            cx="50" cy="50"
            animate={{ r: isSpeaking ? [27.5, 29, 27.5] : [27, 27.5, 27] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.circle cx="35" cy="50" r="16" style={{ x: springX, y: springY }} />
          <motion.circle cx="65" cy="50" r="16" style={{ x: springX, y: springY }} />
          <motion.circle cx="50" cy="35" r="14" style={{ y: springY }} />
        </g>

        {/* ROSTRO (Ojos y Boca juntos para misma prioridad) */}
        <g pointerEvents="none">
          <Ojo cx={42} cy={46} springX={springX} springY={springY} blink={blink} isThinking={isThinking} />
          <Ojo cx={58} cy={46} springX={springX} springY={springY} blink={blink} isThinking={isThinking} />

          {/* BOCA CORREGIDA */}
          <motion.g transform="translate(50, 68)">
            {/* 1. Fondo de la boca abierta (Solo si habla) */}
            <motion.ellipse
              cx="0" cy="0" rx="7"
              animate={{ 
                ry: isSpeaking ? Math.max(0.5, bocaScale * 8) : 0,
                opacity: isSpeaking ? 1 : 0 
              }}
              fill="#220000"
              transition={{ type: "spring", stiffness: 400, damping: 20 }}
            />
            
            {/* 2. Línea de la boca/sonrisa (Solo si NO habla) */}
            <motion.path
              d="M -5 0 Q 0 2 5 0"
              fill="none"
              stroke="black"
              strokeWidth="1.5"
              animate={{ opacity: isSpeaking ? 0 : 0.4 }}
              transition={{ duration: 0.2 }}
            />
          </motion.g>
        </g>
      </svg>
    </motion.div>
  );
};