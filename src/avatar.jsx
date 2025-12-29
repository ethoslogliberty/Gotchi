// src/avatar.jsx - VERSIÓN FINAL: TERNURA + PARPADEO GARANTIZADO
import { motion, useSpring } from 'framer-motion'
import { useState, useEffect, memo } from 'react'

const Ojo = memo(({ cx, cy, springX, springY, blink, isThinking }) => (
  <motion.g 
    style={{ x: springX * 0.15, y: springY * 0.15 }}
  >
    {/* Fondo blanco del ojo */}
    <circle cx={cx} cy={cy} r="7" fill="white" />
    
    {/* Pupila que sigue al mouse */}
    <motion.circle 
      cx={cx} cy={cy} r="3.2" fill="black"
      style={{ x: springX * 0.45, y: springY * 0.45 }} 
    />

    {/* PÁRPADO: Esto garantiza que el parpadeo se vea */}
    <motion.ellipse
      cx={cx} cy={cy - 8} rx="8" ry="8"
      fill="#3b82f6" // Color igual al cuerpo para que parezca que cierra la piel
      initial={{ y: -10 }}
      animate={{ y: blink ? 8 : -10 }}
      transition={{ duration: 0.1, ease: "easeInOut" }}
    />
  </motion.g>
));

export const Avatar = ({ color, mouse, animations, bocaScale = 0, onClick, isSpeaking, status }) => {
  const [blink, setBlink] = useState(false);

  // Físicas suaves pero reactivas
  const springConfig = { stiffness: 120, damping: 12, mass: 0.5 };
  const springX = useSpring(0, springConfig);
  const springY = useSpring(0, springConfig);

  useEffect(() => {
    springX.set(mouse.x * 12); 
    springY.set(mouse.y * 12);
  }, [mouse.x, mouse.y, springX, springY]);

  // LÓGICA DE PARPADEO REFORZADA
  useEffect(() => {
    const loop = () => {
      const randomTime = Math.random() * 3000 + 2000;
      setTimeout(() => {
        setBlink(true);
        setTimeout(() => {
          setBlink(false);
          loop();
        }, 150); // Duración del parpadeo
      }, randomTime);
    };
    loop();
    return () => setBlink(false);
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
          <filter id="gooey-perfect">
            <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur" />
            <feColorMatrix in="blur" mode="matrix" 
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -8" result="goo" />
            <feComposite in="SourceGraphic" in2="goo" operator="atop" />
          </filter>
        </defs>

        {/* CUERPO: 3 Esferas (Centro + Cachetes) - Sin bulto en la frente */}
        <g style={{ filter: 'url(#gooey-perfect)' }} fill={color}>
          {/* Centro / Abdomen */}
          <motion.circle
            cx="50" cy="60"
            animate={{ r: isSpeaking ? [31, 33, 31] : [30, 31, 30] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          {/* Cachetes que dan la forma tierna y ancha */}
          <motion.circle cx="35" cy="62" r="20" style={{ x: springX * 0.2, y: springY * 0.2 }} />
          <motion.circle cx="65" cy="62" r="20" style={{ x: springX * 0.2, y: springY * 0.2 }} />
        </g>

        {/* ROSTRO UNIFICADO: Ojos grandes y abajo (Kawaii) */}
        <motion.g style={{ x: springX * 0.6, y: springY * 0.6 }}>
          <Ojo cx={40} cy={55} springX={springX} springY={springY} blink={blink} isThinking={isThinking} />
          <Ojo cx={60} cy={55} springX={springX} springY={springY} blink={blink} isThinking={isThinking} />

          {/* BOCA: Sonrisa o Habla */}
          <motion.g transform="translate(50, 75)">
            {isSpeaking ? (
              <motion.ellipse
                cx="0" cy="0" rx="5"
                animate={{ ry: Math.max(1.5, bocaScale * 8) }}
                fill="#331111"
                transition={{ type: "spring", stiffness: 400 }}
              />
            ) : (
              <motion.path 
                d="M -5 0 Q 0 3 5 0" 
                fill="none" 
                stroke="black" 
                strokeWidth="1.8" 
                opacity="0.6"
              />
            )}
          </motion.g>
        </motion.g>
      </svg>
    </motion.div>
  );
};