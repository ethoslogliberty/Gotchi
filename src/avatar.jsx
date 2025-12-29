// src/avatar.jsx - VERSIÓN FINAL: SIN ERRORES DE CAPAS Y PARPADEO REAL
import { motion, useSpring } from 'framer-motion'
import { useState, useEffect, memo } from 'react'

const Ojo = memo(({ cx, cy, springX, springY, blink, isThinking, color }) => (
  <motion.g style={{ x: springX * 0.1, y: springY * 0.1 }}>
    {/* Contenedor del ojo con máscara de recorte para evitar "cuernos" */}
    <defs>
      <clipPath id={`clip-ojo-${cx}`}>
        <circle cx={cx} cy={cy} r="7" />
      </clipPath>
    </defs>

    {/* Esclera (Blanco del ojo) */}
    <circle cx={cx} cy={cy} r="7" fill="white" />
    
    {/* Pupila */}
    <motion.circle 
      cx={cx} cy={cy} r="3.2" fill="black"
      style={{ x: springX * 0.4, y: springY * 0.4 }} 
    />

    {/* PÁRPADO (Interno: nunca sale del círculo del ojo) */}
    <motion.rect
      x={cx - 8} y={cy - 16} width="16" height="16"
      fill={color} // Usa el color exacto del cuerpo
      clipPath={`url(#clip-ojo-${cx})`}
      initial={{ y: 0 }}
      animate={{ y: blink ? 16 : 0 }}
      transition={{ duration: 0.12, ease: "easeInOut" }}
    />
  </motion.g>
));

export const Avatar = ({ color, mouse, animations, bocaScale = 0, onClick, isSpeaking, status }) => {
  const [blink, setBlink] = useState(false);

  // Físicas elásticas equilibradas
  const springConfig = { stiffness: 110, damping: 15, mass: 0.6 };
  const springX = useSpring(0, springConfig);
  const springY = useSpring(0, springConfig);

  useEffect(() => {
    springX.set(mouse.x * 12); 
    springY.set(mouse.y * 12);
  }, [mouse.x, mouse.y, springX, springY]);

  // Lógica de parpadeo estable
  useEffect(() => {
    let timeout;
    const loop = () => {
      timeout = setTimeout(() => {
        setBlink(true);
        setTimeout(() => {
          setBlink(false);
          loop();
        }, 150);
      }, 3000 + Math.random() * 3000);
    };
    loop();
    return () => clearTimeout(timeout);
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
          <filter id="gooey-final">
            <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur" />
            <feColorMatrix in="blur" mode="matrix" 
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -8" result="goo" />
            <feComposite in="SourceGraphic" in2="goo" operator="atop" />
          </filter>
        </defs>

        {/* CUERPO: Formas simples y tiernas sin bultos frontales */}
        <g style={{ filter: 'url(#gooey-final)' }} fill={color}>
          {/* Centro gordo y tierno */}
          <motion.circle
            cx="50" cy="62"
            animate={{ r: isSpeaking ? [31, 33, 31] : [30, 31, 30] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          {/* Cachetes que fluyen con el movimiento */}
          <motion.circle cx="35" cy="65" r="18" style={{ x: springX * 0.2, y: springY * 0.2 }} />
          <motion.circle cx="65" cy="65" r="18" style={{ x: springX * 0.2, y: springY * 0.2 }} />
        </g>

        {/* ROSTRO UNIFICADO: Ojos y Boca anclados */}
        <motion.g style={{ x: springX * 0.5, y: springY * 0.5 }}>
          <Ojo cx={40} cy={58} springX={springX} springY={springY} blink={blink} isThinking={isThinking} color={color} />
          <Ojo cx={60} cy={58} springX={springX} springY={springY} blink={blink} isThinking={isThinking} color={color} />

          {/* BOCA: Sonrisa o Apertura elástica */}
          <motion.g transform="translate(50, 76)">
            {isSpeaking ? (
              <motion.ellipse
                cx="0" cy="0" rx="5.5"
                animate={{ ry: Math.max(1.5, bocaScale * 8) }}
                fill="#331111"
                transition={{ type: "spring", stiffness: 400 }}
              />
            ) : (
              <motion.path 
                d="M -4.5 0 Q 0 3 4.5 0" 
                fill="none" 
                stroke="black" 
                strokeWidth="1.8" 
                opacity="0.5"
              />
            )}
          </motion.g>
        </motion.g>
      </svg>
    </motion.div>
  );
};