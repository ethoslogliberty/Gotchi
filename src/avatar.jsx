// src/avatar.jsx
import { motion, useSpring } from 'framer-motion'
import { useState, useEffect } from 'react'

export const Avatar = ({ color, mouse, animations, bocaScale = 0, onClick, isSpeaking, status }) => {
  const [blink, setBlink] = useState(false);

  // CONFIGURACIÓN ELÁSTICA (Evita vibraciones y da fluidez)
  const springConfig = { stiffness: 120, damping: 20 };
  const springX = useSpring(0, springConfig);
  const springY = useSpring(0, springConfig);

  // Actualizamos los resortes con la posición del mouse
  useEffect(() => {
    springX.set(mouse.x * 0.8);
    springY.set(mouse.y * 0.8);
  }, [mouse, springX, springY]);

  // LÓGICA DE PARPADEO ORGÁNICO
  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setBlink(true);
      setTimeout(() => setBlink(false), 100);
    }, Math.random() * 3000 + 4000);
    return () => clearInterval(blinkInterval);
  }, []);

  const isThinking = status?.includes("Reflexionando");

  // COMPONENTE DE OJO ESTABILIZADO (Fuera del ruido de renderizado)
  const Ojo = ({ cx, cy }) => (
    <motion.g 
      animate={{ scaleY: blink ? 0.05 : (isThinking ? 0.6 : 1) }}
      transition={{ duration: 0.1 }}
      style={{ originX: `${cx}%`, originY: `${cy}%` }}
    >
      <circle cx={cx} cy={cy} r="6" fill="white" />
      <motion.circle 
        cx={cx} cy={cy} r="2.8" fill="black"
        style={{ x: springX, y: springY }} // Usa el resorte suavizado
      />
    </motion.g>
  );

  return (
    <motion.div 
      onClick={onClick}
      style={{ cursor: 'pointer', position: 'relative' }}
      whileTap={{ scale: 0.9 }}
    >
      <svg width="280" height="280" viewBox="0 0 100 100" style={{ overflow: 'visible' }}>
        <defs>
          {/* FILTRO DE FUSIÓN ORGÁNICA (GOOEY) */}
          <filter id="azulito-fluid-filter">
            <feGaussianBlur in="SourceGraphic" stdDeviation="3.5" result="blur" />
            <feColorMatrix in="blur" mode="matrix" 
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 20 -10" result="goo" />
            <feComposite in="SourceGraphic" in2="goo" operator="atop" />
          </filter>
        </defs>

        {/* CUERPO LÍQUIDO (Solo esto lleva el filtro de deformación) */}
        <g style={{ filter: 'url(#azulito-fluid-filter)' }} fill={color}>
          {/* Esfera central */}
          <motion.circle
            cx="50" cy="50"
            animate={{ 
              r: isSpeaking ? [28, 30, 28] : [27, 28, 27],
              scaleY: isSpeaking ? [1, 1.05, 1] : 1
            }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />
          {/* Gotas laterales que reaccionan a la inercia */}
          <motion.circle cx="35" cy="50" r="16" style={{ x: springX, y: springY }} />
          <motion.circle cx="65" cy="50" r="16" style={{ x: springX, y: springY }} />
          <motion.circle cx="50" cy="35" r="14" style={{ y: springY }} />
        </g>

        {/* ROSTRO ESTABILIZADO (Sin filtro para evitar que los ojos vibren o se vean borrosos) */}
        <g>
          <Ojo cx={42} cy={46} />
          <Ojo cx={58} cy={46} />

          <motion.g transform="translate(50, 68)">
            <motion.ellipse
              cx="0" cy="0" rx="6"
              animate={{ 
                ry: Math.max(0, 0.5 + bocaScale * 7), 
                opacity: isSpeaking ? 1 : 0 
              }}
              fill="#220000"
              transition={{ type: "spring", stiffness: 300, damping: 15 }}
            />
            {!isSpeaking && (
              <path d="M -4 0 Q 0 1.5 4 0" fill="none" stroke="#000" strokeWidth="1.2" opacity="0.4" />
            )}
          </motion.g>
        </g>
      </svg>
    </motion.div>
  );
};