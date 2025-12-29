// src/avatar.jsx - VERSIÓN "TERNURA Y FLUIDEZ"
import { motion, useSpring } from 'framer-motion'
import { useState, useEffect, memo } from 'react'

const Ojo = memo(({ cx, cy, springX, springY, blink, isThinking }) => (
  <motion.g 
    style={{ x: springX * 0.12, y: springY * 0.12 }}
    animate={{ scaleY: blink ? 0.01 : (isThinking ? 0.6 : 1) }}
    transition={{ duration: 0.08 }} // Parpadeo más rápido y marcado
  >
    <circle cx={cx} cy={cy} r="6.5" fill="white" /> {/* Ojos un poco más grandes = más tierno */}
    <motion.circle 
      cx={cx} cy={cy} r="3" fill="black"
      style={{ x: springX * 0.4, y: springY * 0.4 }} 
    />
  </motion.g>
));

export const Avatar = ({ color, mouse, animations, bocaScale = 0, onClick, isSpeaking, status }) => {
  const [blink, setBlink] = useState(false);

  // FÍSICAS MÁS REBOTINES (Stiffness más alto para que se mueva más)
  const springConfig = { stiffness: 150, damping: 15, mass: 0.6 };
  const springX = useSpring(0, springConfig);
  const springY = useSpring(0, springConfig);

  useEffect(() => {
    // Aumentamos el multiplicador para que el movimiento se note más
    springX.set(mouse.x * 15); 
    springY.set(mouse.y * 15);
  }, [mouse.x, mouse.y, springX, springY]);

  // PARPADEO CORREGIDO: Intervalo más corto y reactivo
  useEffect(() => {
    const triggerBlink = () => {
      setBlink(true);
      setTimeout(() => setBlink(false), 150); // Tiempo visible de parpadeo
    };
    const timer = setInterval(triggerBlink, 3000 + Math.random() * 2000);
    return () => clearInterval(timer);
  }, []);

  const isThinking = status?.includes("Reflexionando");

  return (
    <motion.div 
      onClick={onClick} 
      style={{ cursor: 'pointer', position: 'relative' }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.9 }}
    >
      <svg width="280" height="280" viewBox="0 0 100 100" style={{ overflow: 'visible' }}>
        <defs>
          <filter id="gooey-tierno">
            <feGaussianBlur in="SourceGraphic" stdDeviation="2.8" result="blur" />
            <feColorMatrix in="blur" mode="matrix" 
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -8" result="goo" />
            <feComposite in="SourceGraphic" in2="goo" operator="atop" />
          </filter>
        </defs>

        {/* CUERPO: Eliminamos el círculo de la frente y suavizamos la forma */}
        <g style={{ filter: 'url(#gooey-tierno)' }} fill={color}>
          {/* Cuerpo principal (más redondito) */}
          <motion.circle
            cx="50" cy="55"
            animate={{ 
              r: isSpeaking ? [30, 32, 30] : [29, 30, 29],
            }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />
          {/* Cachetes/Base que reacciona al mouse */}
          <motion.circle cx="38" cy="60" r="18" style={{ x: springX * 0.3, y: springY * 0.3 }} />
          <motion.circle cx="62" cy="60" r="18" style={{ x: springX * 0.3, y: springY * 0.3 }} />
        </g>

        {/* CARA: Unificada y más abajo para que sea "Kawaii" */}
        <motion.g style={{ x: springX * 0.5, y: springY * 0.5 }}>
          <Ojo cx={40} cy={52} springX={springX} springY={springY} blink={blink} isThinking={isThinking} />
          <Ojo cx={60} cy={52} springX={springX} springY={springY} blink={blink} isThinking={isThinking} />

          {/* BOCA: Siempre visible (o como sonrisa o abierta) */}
          <motion.g transform="translate(50, 72)">
            {isSpeaking ? (
              <motion.ellipse
                cx="0" cy="0" rx="5"
                animate={{ ry: Math.max(1, bocaScale * 7) }}
                fill="#331111"
                transition={{ type: "spring", stiffness: 400 }}
              />
            ) : (
              <motion.path 
                d="M -4 0 Q 0 2.5 4 0" 
                fill="none" 
                stroke="#000" 
                strokeWidth="1.5" 
                opacity="0.5"
              />
            )}
          </motion.g>
        </motion.g>
      </svg>
    </motion.div>
  );
};