// src/avatar.jsx - VERSIÓN FINAL INTEGRADA Y CORREGIDA
import { motion, useSpring } from 'framer-motion'
import { useState, useEffect, memo } from 'react'

// COMPONENTE OJO: Memorizado para evitar vibraciones
const Ojo = memo(({ cx, cy, springX, springY, blink, isThinking }) => (
  <motion.g 
    // El ojo entero se desplaza levemente para dar profundidad
    style={{ x: springX * 0.1, y: springY * 0.1 }}
    animate={{ scaleY: blink ? 0.05 : (isThinking ? 0.6 : 1) }}
    transition={{ duration: 0.1 }}
  >
    <circle cx={cx} cy={cy} r="5.8" fill="white" />
    <motion.circle 
      cx={cx} cy={cy} r="2.6" fill="black"
      // La pupila se mueve más que el fondo para efecto 3D
      style={{ x: springX * 0.5, y: springY * 0.5 }} 
    />
  </motion.g>
));

export const Avatar = ({ color, mouse, animations, bocaScale = 0, onClick, isSpeaking, status }) => {
  const [blink, setBlink] = useState(false);

  // FÍSICAS: Movimiento pesado y viscoso (Gooey)
  const springConfig = { stiffness: 90, damping: 20, mass: 0.8 };
  const springX = useSpring(0, springConfig);
  const springY = useSpring(0, springConfig);

  useEffect(() => {
    // Escalamiento del mouse para un rango de movimiento natural
    springX.set(mouse.x * 8); 
    springY.set(mouse.y * 8);
  }, [mouse.x, mouse.y, springX, springY]);

  // LÓGICA DE PARPADEO: Corregida para estabilidad
  useEffect(() => {
    const triggerBlink = () => {
      setBlink(true);
      setTimeout(() => setBlink(false), 100); // Duración del parpadeo
    };
    const interval = setInterval(triggerBlink, Math.random() * 3000 + 3500);
    return () => clearInterval(interval);
  }, []);

  const isThinking = status?.includes("Reflexionando");

  return (
    <motion.div 
      onClick={onClick} 
      style={{ cursor: 'pointer', position: 'relative' }}
      whileTap={{ scale: 0.95 }}
    >
      <svg width="280" height="280" viewBox="0 0 100 100" style={{ overflow: 'visible' }}>
        <defs>
          {/* Filtro Gooey Profesional */}
          <filter id="final-gooey-effect">
            <feGaussianBlur in="SourceGraphic" stdDeviation="3.2" result="blur" />
            <feColorMatrix in="blur" mode="matrix" 
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 19 -9" result="goo" />
            <feComposite in="SourceGraphic" in2="goo" operator="atop" />
          </filter>
          
          {/* Degradado para volumen 3D */}
          <radialGradient id="bodyGrad" cx="45%" cy="35%" r="60%">
            <stop offset="0%" stopColor="#87b9ff" />
            <stop offset="100%" stopColor={color} />
          </radialGradient>
        </defs>

        {/* CUERPO LÍQUIDO: Esferas fusionadas */}
        <g style={{ filter: 'url(#final-gooey-effect)' }} fill="url(#bodyGrad)">
          {/* Base que respira */}
          <motion.circle
            cx="50" cy="50"
            animate={{ 
              r: isSpeaking ? [27, 29, 27] : [26.5, 27.5, 26.5],
              scaleY: isSpeaking ? [1, 1.05, 1] : 1
            }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          />
          {/* Gotas de inercia laterales */}
          <motion.circle cx="35" cy="50" r="16" style={{ x: springX * 0.4, y: springY * 0.4 }} />
          <motion.circle cx="65" cy="50" r="16" style={{ x: springX * 0.4, y: springY * 0.4 }} />
          <motion.circle cx="50" cy="35" r="14" style={{ y: springY * 0.6 }} />
        </g>

        {/* ROSTRO UNIFICADO: Ojos y Boca se mueven juntos */}
        <motion.g style={{ x: springX * 0.3, y: springY * 0.3 }}>
          <Ojo cx={42} cy={46} springX={springX} springY={springY} blink={blink} isThinking={isThinking} />
          <Ojo cx={58} cy={46} springX={springX} springY={springY} blink={blink} isThinking={isThinking} />

          {/* Sistema de Boca Dinámica */}
          <motion.g transform="translate(50, 68)">
            {/* Elipse de habla (Visible solo al hablar) */}
            <motion.ellipse
              cx="0" cy="0" rx="6"
              animate={{ 
                ry: isSpeaking ? Math.max(0.8, bocaScale * 8) : 0,
                opacity: isSpeaking ? 1 : 0 
              }}
              fill="#220000"
              transition={{ type: "spring", stiffness: 400, damping: 20 }}
            />
            {/* Línea de sonrisa (Visible solo al estar en silencio) */}
            {!isSpeaking && (
              <motion.path 
                d="M -4 0 Q 0 1.5 4 0" 
                fill="none" 
                stroke="#000" 
                strokeWidth="1.2" 
                opacity="0.4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.4 }}
              />
            )}
          </motion.g>
        </motion.g>
      </svg>
    </motion.div>
  );
};