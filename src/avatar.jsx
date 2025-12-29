// src/avatar.jsx
import { motion, useSpring, useTransform } from 'framer-motion'
import { useState, useEffect } from 'react'

export const Avatar = ({ color, mouse, animations, bocaScale = 0, onClick, isSpeaking, status }) => {
  const [blink, setBlink] = useState(false);

  // FÍSICAS ELÁSTICAS PARA EL CUERPO
  // Esto hace que el movimiento no sea lineal, sino que tenga "inercia"
  const springConfig = { stiffness: 150, damping: 15 };
  const dx = useSpring(mouse.x, springConfig);
  const dy = useSpring(mouse.y, springConfig);

  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setBlink(true);
      setTimeout(() => setBlink(false), 120);
    }, Math.random() * 3000 + 4000);
    return () => clearInterval(blinkInterval);
  }, []);

  const isThinking = status?.includes("Reflexionando");

  // COMPONENTE DE OJO CON SEGUIMIENTO FLUIDO
  const Ojo = ({ cx, cy }) => (
    <motion.g 
      animate={{ scaleY: blink ? 0.05 : (isThinking ? 0.6 : 1) }}
      transition={{ duration: 0.1 }}
      style={{ originX: `${cx}%`, originY: `${cy}%` }}
    >
      <circle cx={cx} cy={cy} r="6" fill="white" />
      <motion.circle 
        cx={cx} cy={cy} r="2.8" fill="black"
        style={{ x: dx, y: dy }} 
      />
    </motion.g>
  );

  return (
    <motion.div 
      onClick={onClick}
      style={{ cursor: 'pointer', filter: 'url(#gooey-effect)' }} // Aplicamos el filtro de fusión
      whileTap={{ scale: 0.85 }}
    >
      <svg width="280" height="280" viewBox="0 0 100 100" style={{ overflow: 'visible' }}>
        <defs>
          {/* FILTRO PROFESIONAL GOOEY (Efecto de fusión de fluidos) */}
          <filter id="gooey-effect">
            <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur" />
            <feColorMatrix in="blur" mode="matrix" 
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 19 -9" result="goo" />
            <feComposite in="SourceGraphic" in2="goo" operator="atop" />
          </filter>
        </defs>

        {/* CUERPO MULTI-CAPA PARA LOGRAR FLUIDEZ */}
        <g fill={color}>
          {/* Capa base que respira */}
          <motion.circle
            cx="50" cy="55"
            animate={{ 
              r: isSpeaking ? [30, 32, 30] : [28, 29, 28],
              scaleX: isSpeaking ? [1, 1.1, 1] : 1
            }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />
          {/* "Gota" superior que le da forma orgánica */}
          <motion.circle
            cx="50" cy="45"
            animate={{ 
              y: isSpeaking ? [-2, 2, -2] : [0, -3, 0],
              scale: isSpeaking ? 1.2 : 1.1
            }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          />
          {/* Lados que reaccionan al movimiento del mouse (Inercia de fluido) */}
          <motion.circle cx="35" cy="55" r="15" style={{ x: dx, y: dy }} />
          <motion.circle cx="65" cy="55" r="15" style={{ x: dx, y: dy }} />
        </g>

        {/* CARA (Fuera del filtro gooey para que no se deforme el dibujo) */}
        <g style={{ filter: 'none' }}>
          <Ojo cx={42} cy={48} />
          <Ojo cx={58} cy={48} />

          <motion.g transform="translate(50, 68)">
            <motion.ellipse
              cx="0" cy="0" rx="6"
              animate={{ 
                ry: Math.max(0, 1 + bocaScale * 7), 
                opacity: isSpeaking ? 1 : 0 
              }}
              fill="#220000"
            />
            {!isSpeaking && (
              <path d="M -4 0 Q 0 1.5 4 0" fill="none" stroke="#000" strokeWidth="1" opacity="0.3" />
            )}
          </motion.g>
        </g>
      </svg>
    </motion.div>
  );
};