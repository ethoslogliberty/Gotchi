// src/avatar.jsx
import { motion, useSpring } from 'framer-motion'
import { useState, useEffect, memo } from 'react'

const Ojo = memo(({ cx, cy, springX, springY, blink, isThinking }) => (
  <motion.g 
    // Ahora TODO el ojo (blanco y pupila) se desplaza levemente con el mouse
    style={{ 
      x: springX * 0.2, 
      y: springY * 0.2 
    }}
    animate={{ scaleY: blink ? 0.05 : (isThinking ? 0.6 : 1) }}
    transition={{ type: "spring", stiffness: 500, damping: 30 }}
  >
    {/* El fondo blanco del ojo */}
    <circle cx={cx} cy={cy} r="6" fill="white" />
    
    {/* La pupila se mueve MÁS que el fondo para dar efecto 3D */}
    <motion.circle 
      cx={cx} cy={cy} r="2.8" fill="black"
      style={{ 
        x: springX * 0.6, 
        y: springY * 0.6 
      }} 
    />
  </motion.g>
));

export const Avatar = ({ color, mouse, animations, bocaScale = 0, onClick, isSpeaking, status }) => {
  const [blink, setBlink] = useState(false);

  // Configuración de resortes para suavizar el movimiento
  const springConfig = { stiffness: 100, damping: 25, mass: 0.5 };
  const springX = useSpring(0, springConfig);
  const springY = useSpring(0, springConfig);

  useEffect(() => {
    // Normalizamos el movimiento
    springX.set(mouse.x);
    springY.set(mouse.y);
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
      <svg width="280" height="280" viewBox="0 0 100 100" style={{ overflow: 'visible' }}>
        <defs>
          <filter id="azulito-fluid-filter">
            <feGaussianBlur in="SourceGraphic" stdDeviation="3.5" result="blur" />
            <feColorMatrix in="blur" mode="matrix" 
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 20 -10" result="goo" />
            <feComposite in="SourceGraphic" in2="goo" operator="atop" />
          </filter>
        </defs>

        {/* CUERPO LÍQUIDO (Se deforma levemente con el mouse) */}
        <g style={{ filter: 'url(#azulito-fluid-filter)' }} fill={color}>
          <motion.circle cx="50" cy="50" r="28" />
          <motion.circle cx="35" cy="50" r="16" style={{ x: springX * 0.5, y: springY * 0.5 }} />
          <motion.circle cx="65" cy="50" r="16" style={{ x: springX * 0.5, y: springY * 0.5 }} />
        </g>

        {/* ROSTRO UNIFICADO (Toda la cara se mueve junta) */}
        <motion.g 
          style={{ 
            x: springX * 0.4, // El rostro sigue al mouse suavemente
            y: springY * 0.4 
          }}
        >
          <Ojo cx={42} cy={46} springX={springX} springY={springY} blink={blink} isThinking={isThinking} />
          <Ojo cx={58} cy={46} springX={springX} springY={springY} blink={blink} isThinking={isThinking} />

          {/* BOCA (Ahora también sigue el movimiento facial) */}
          <motion.g transform="translate(50, 68)">
            <motion.ellipse
              cx="0" cy="0" rx="6"
              animate={{ ry: isSpeaking ? Math.max(0.5, bocaScale * 7.5) : 0 }}
              fill="#220000"
              style={{ opacity: isSpeaking ? 1 : 0 }}
            />
            {!isSpeaking && (
              <path d="M -4 0 Q 0 1.5 4 0" fill="none" stroke="#000" strokeWidth="1.2" opacity="0.4" />
            )}
          </motion.g>
        </motion.g>
      </svg>
    </motion.div>
  );
};