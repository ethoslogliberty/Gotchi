// src/avatar.jsx - VERSIÓN "MIRADA VIVA" (Kawaii & 3D Depth)
import { motion, useSpring, useTransform } from 'framer-motion'
import { useState, useEffect, memo } from 'react'

const Ojo = memo(({ cx, cy, springX, springY, blink }) => {
  // Usamos useTransform para que los ojos sigan al resorte correctamente
  const eyeX = useTransform(springX, (v) => v * 0.15);
  const eyeY = useTransform(springY, (v) => v * 0.15);
  const pupilX = useTransform(springX, (v) => v * 0.5);
  const pupilY = useTransform(springY, (v) => v * 0.5);
  const brilloX = useTransform(springX, (v) => v * 0.6);
  const brilloY = useTransform(springY, (v) => v * 0.6);

  return (
    <motion.g 
      style={{ x: eyeX, y: eyeY, originX: `${cx}%`, originY: `${cy}%` }}
      animate={{ scaleY: blink ? 0 : 1 }}
      transition={{ duration: 0.08 }}
    >
      {/* Blanco del ojo (más grande = más tierno) */}
      <circle cx={cx} cy={cy} r="8.5" fill="white" /> 
      
      {/* Pupila: Seguimiento dinámico */}
      <motion.circle 
        cx={cx} cy={cy} r="4.5" fill="black"
        style={{ x: pupilX, y: pupilY }} 
      />
      
      {/* Brillo Kawaii: El toque de alma en la mirada */}
      <motion.circle 
        cx={cx - 2.5} cy={cy - 2.5} r="2" fill="white"
        style={{ x: brilloX, y: brilloY }} 
      />
    </motion.g>
  );
});

export const Avatar = ({ color, mouse, animations, bocaScale = 0, onClick, isSpeaking, status }) => {
  const [blink, setBlink] = useState(false);

  // Físicas elásticas (Rebotín)
  const springConfig = { stiffness: 180, damping: 15, mass: 0.5 };
  const springX = useSpring(0, springConfig);
  const springY = useSpring(0, springConfig);

  // Transformaciones para el cuerpo y la cara
  const faceX = useTransform(springX, (v) => v * 0.4);
  const faceY = useTransform(springY, (v) => v * 0.4);
  const bodyX = useTransform(springX, (v) => v * 0.2);
  const bodyY = useTransform(springY, (v) => v * 0.2);

  useEffect(() => {
    // Escalamiento del mouse para un rango de movimiento natural
    // Si mouse.x viene de -1 a 1, esto da un rango de -15 a 15
    springX.set((mouse.x || 0) * 15); 
    springY.set((mouse.y || 0) * 15);
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

        {/* CUERPO: Gota de agua tierna con inercia */}
        <g style={{ filter: 'url(#gooey-final-kawaii)' }} fill={color}>
          <motion.circle
            cx="50" cy="65"
            animate={{ r: isSpeaking ? [31, 33, 31] : [30, 31, 30] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          {/* Cachetes que se mueven levemente */}
          <motion.circle cx="35" cy="70" r="22" style={{ x: bodyX, y: bodyY }} />
          <motion.circle cx="65" cy="70" r="22" style={{ x: bodyX, y: bodyY }} />
        </g>

        {/* CARA UNIFICADA: Todo el rostro sigue al mouse de forma fluida */}
        <motion.g style={{ x: faceX, y: faceY }}>
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