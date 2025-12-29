// src/avatar.jsx - VERSIÓN "MIRADA VIVA" (Kawaii y Natural)
import { motion, useSpring } from 'framer-motion'
import { useState, useEffect, memo } from 'react'

const Ojo = memo(({ cx, cy, springX, springY, blink }) => (
  <motion.g 
    // Toda la estructura del ojo sigue al mouse suavemente
    style={{ 
      x: springX * 0.1, 
      y: springY * 0.1,
      originX: `${cx}%`, 
      originY: `${cy}%` 
    }}
    animate={{ scaleY: blink ? 0 : 1 }}
    transition={{ duration: 0.08 }}
  >
    {/* Blanco del ojo */}
    <circle cx={cx} cy={cy} r="8" fill="white" /> 
    
    {/* Pupila: Se mueve MÁS que el blanco para dar profundidad 3D */}
    <motion.circle 
      cx={cx} cy={cy} r="4.2" fill="black"
      style={{ 
        x: springX * 0.5, 
        y: springY * 0.5 
      }} 
    />
    
    {/* Brillo Kawaii: Sigue a la pupila para mantener la "chispa" */}
    <motion.circle 
      cx={cx - 2.5} cy={cy - 2.5} r="1.8" fill="white"
      style={{ 
        x: springX * 0.6, 
        y: springY * 0.6 
      }} 
    />
  </motion.g>
));

export const Avatar = ({ color, mouse, animations, bocaScale = 0, onClick, isSpeaking, status }) => {
  const [blink, setBlink] = useState(false);

  // Físicas elásticas para que se sienta como gelatina
  const springConfig = { stiffness: 150, damping: 15, mass: 0.6 };
  const springX = useSpring(0, springConfig);
  const springY = useSpring(0, springConfig);

  useEffect(() => {
    // Capturamos el movimiento del mouse
    springX.set(mouse.x * 12); 
    springY.set(mouse.y * 12);
  }, [mouse.x, mouse.y, springX, springY]);

  // Lógica de parpadeo rítmico
  useEffect(() => {
    let timeout;
    const loop = () => {
      timeout = setTimeout(() => {
        setBlink(true);
        setTimeout(() => {
          setBlink(false);
          loop();
        }, 100);
      }, 2000 + Math.random() * 4000);
    };
    loop();
    return () => clearTimeout(timeout);
  }, []);

  return (
    <motion.div 
      onClick={onClick} 
      style={{ cursor: 'pointer', position: 'relative' }}
      whileTap={{ scale: 0.95 }}
    >
      <svg width="280" height="280" viewBox="0 0 100 100" style={{ overflow: 'visible' }}>
        <defs>
          <filter id="gooey-kawaii-master">
            <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur" />
            <feColorMatrix in="blur" mode="matrix" 
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 20 -10" result="goo" />
            <feComposite in="SourceGraphic" in2="goo" operator="atop" />
          </filter>
        </defs>

        {/* CUERPO LÍQUIDO: Sin bultos, pura fluidez */}
        <g style={{ filter: 'url(#gooey-kawaii-master)' }} fill={color}>
          <motion.circle
            cx="50" cy="65"
            animate={{ r: isSpeaking ? [31, 33, 31] : [30, 31, 30] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.circle cx="35" cy="70" r="22" style={{ x: springX * 0.3, y: springY * 0.3 }} />
          <motion.circle cx="65" cy="70" r="22" style={{ x: springX * 0.3, y: springY * 0.3 }} />
        </g>

        {/* CARA UNIFICADA: Se mueve con el cuerpo para evitar el efecto psicótico */}
        <motion.g style={{ x: springX * 0.4, y: springY * 0.4 }}>
          <Ojo cx={38} cy={64} springX={springX} springY={springY} blink={blink} />
          <Ojo cx={62} cy={64} springX={springX} springY={springY} blink={blink} />

          {/* BOCA: Sonrisita amigable */}
          <motion.g transform="translate(50, 78)">
            {isSpeaking ? (
              <motion.ellipse
                cx="0" cy="0" rx="5"
                animate={{ ry: Math.max(1.5, bocaScale * 9) }}
                fill="#331111"
                transition={{ type: "spring", stiffness: 400 }}
              />
            ) : (
              <motion.path 
                d="M -4 0 Q 0 3 4 0" 
                fill="none" 
                stroke="black" 
                strokeWidth="2.2" 
                strokeLinecap="round"
                opacity="0.6"
              />
            )}
          </motion.g>
        </motion.g>
      </svg>
    </motion.div>
  );
};