// src/avatar.jsx - VERSIÓN FINAL: MIRADA VIVA + KAWAII
import { motion, useSpring } from 'framer-motion'
import { useState, useEffect, memo } from 'react'

const Ojo = memo(({ cx, cy, springX, springY, blink }) => (
  <motion.g 
    // El ojo entero se desplaza para acompañar la cara
    style={{ 
      x: springX * 0.2, 
      y: springY * 0.2,
      originX: `${cx}%`, 
      originY: `${cy}%` 
    }}
    animate={{ scaleY: blink ? 0 : 1 }}
    transition={{ duration: 0.08 }}
  >
    {/* Blanco del ojo (más grande = más tierno) */}
    <circle cx={cx} cy={cy} r="8.5" fill="white" /> 
    
    {/* Pupila: Se mueve MUCHO para que sientas que te sigue */}
    <motion.circle 
      cx={cx} cy={cy} r="4.5" fill="black"
      style={{ 
        x: springX * 0.6, 
        y: springY * 0.6 
      }} 
    />
    
    {/* Brillo Kawaii: El toque de ternura definitivo */}
    <motion.circle 
      cx={cx - 2.5} cy={cy - 2.5} r="2" fill="white"
      style={{ 
        x: springX * 0.7, 
        y: springY * 0.7 
      }} 
    />
  </motion.g>
));

export const Avatar = ({ color, mouse, animations, bocaScale = 0, onClick, isSpeaking, status }) => {
  const [blink, setBlink] = useState(false);

  // Físicas muy elásticas (Rebotín)
  const springConfig = { stiffness: 200, damping: 15, mass: 0.5 };
  const springX = useSpring(0, springConfig);
  const springY = useSpring(0, springConfig);

  useEffect(() => {
    // Aumentamos el rango de movimiento (multiplicador 15)
    springX.set(mouse.x * 15); 
    springY.set(mouse.y * 15);
  }, [mouse.x, mouse.y, springX, springY]);

  // Parpadeo tierno y rítmico
  useEffect(() => {
    const loop = () => {
      setTimeout(() => {
        setBlink(true);
        setTimeout(() => {
          setBlink(false);
          loop();
        }, 100);
      }, 2000 + Math.random() * 3000);
    };
    loop();
  }, []);

  return (
    <motion.div 
      onClick={onClick} 
      style={{ cursor: 'pointer', position: 'relative' }}
      whileTap={{ scale: 0.95 }}
    >
      <svg width="280" height="280" viewBox="0 0 100 100" style={{ overflow: 'visible' }}>
        <defs>
          <filter id="gooey-final-kawaii">
            <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur" />
            <feColorMatrix in="blur" mode="matrix" 
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 20 -10" result="goo" />
            <feComposite in="SourceGraphic" in2="goo" operator="atop" />
          </filter>
        </defs>

        {/* CUERPO: Gota de agua tierna y redondita */}
        <g style={{ filter: 'url(#gooey-final-kawaii)' }} fill={color}>
          <motion.circle
            cx="50" cy="65"
            animate={{ r: isSpeaking ? [31, 33, 31] : [30, 31, 30] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          {/* Cachetes que le dan la forma redonda */}
          <motion.circle cx="35" cy="70" r="22" style={{ x: springX * 0.3, y: springY * 0.3 }} />
          <motion.circle cx="65" cy="70" r="22" style={{ x: springX * 0.3, y: springY * 0.3 }} />
        </g>

        {/* CARA UNIFICADA: Todo el rostro sigue al mouse */}
        <motion.g style={{ x: springX * 0.5, y: springY * 0.5 }}>
          <Ojo cx={38} cy={64} springX={springX} springY={springY} blink={blink} />
          <Ojo cx={62} cy={64} springX={springX} springY={springY} blink={blink} />

          {/* BOCA: Sonrisa o Habla */}
          <motion.g transform="translate(50, 78)">
            {isSpeaking ? (
              <motion.ellipse
                cx="0" cy="0" rx="5"
                animate={{ ry: Math.max(2, bocaScale * 9) }}
                fill="#331111"
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