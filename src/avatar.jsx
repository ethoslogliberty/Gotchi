// src/avatar.jsx - VERSIÓN KAWAII FINAL (Sin errores de estilo)
import { motion, useSpring } from 'framer-motion'
import { useState, useEffect, memo } from 'react'

const Ojo = memo(({ cx, cy, springX, springY, blink }) => (
  <motion.g 
    // UNIFICAMOS EL STYLE AQUÍ (Sin duplicados)
    style={{ 
      x: springX * 0.15, 
      y: springY * 0.15,
      originX: `${cx}%`, 
      originY: `${cy}%` 
    }}
    animate={{ scaleY: blink ? 0 : 1 }}
    transition={{ duration: 0.08 }}
  >
    {/* Fondo blanco del ojo */}
    <circle cx={cx} cy={cy} r="8" fill="white" /> 
    
    {/* Pupila negra */}
    <motion.circle 
      cx={cx} cy={cy} r="4" fill="black"
      style={{ x: springX * 0.5, y: springY * 0.5 }} 
    />
    
    {/* Brillo tierno (Punto de luz) */}
    <motion.circle 
      cx={cx - 2} cy={cy - 2} r="1.8" fill="white"
      style={{ x: springX * 0.6, y: springY * 0.6 }} 
    />
  </motion.g>
));

export const Avatar = ({ color, mouse, animations, bocaScale = 0, onClick, isSpeaking, status }) => {
  const [blink, setBlink] = useState(false);

  // Físicas de gelatina
  const springConfig = { stiffness: 170, damping: 15, mass: 0.5 };
  const springX = useSpring(0, springConfig);
  const springY = useSpring(0, springConfig);

  useEffect(() => {
    springX.set(mouse.x * 10); 
    springY.set(mouse.y * 10);
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
        }, 100);
      }, 2500 + Math.random() * 3000);
    };
    loop();
    return () => clearTimeout(timeout);
  }, []);

  return (
    <motion.div 
      onClick={onClick} 
      style={{ cursor: 'pointer', position: 'relative' }}
      whileTap={{ scale: 0.9 }}
    >
      <svg width="280" height="280" viewBox="0 0 100 100" style={{ overflow: 'visible' }}>
        <defs>
          <filter id="gooey-kawaii-final">
            <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur" />
            <feColorMatrix in="blur" mode="matrix" 
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 20 -10" result="goo" />
            <feComposite in="SourceGraphic" in2="goo" operator="atop" />
          </filter>
        </defs>

        {/* CUERPO: Gota gorda y tierna (Sin bultos en la frente) */}
        <g style={{ filter: 'url(#gooey-kawaii-final)' }} fill={color}>
          <motion.circle
            cx="50" cy="65"
            animate={{ r: isSpeaking ? [32, 34, 32] : [31, 32, 31] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          {/* Cachetes que dan la forma redondeada inferior */}
          <motion.circle cx="35" cy="70" r="22" style={{ x: springX * 0.2, y: springY * 0.2 }} />
          <motion.circle cx="65" cy="70" r="22" style={{ x: springX * 0.2, y: springY * 0.2 }} />
        </g>

        {/* CARA: Ubicada abajo para máxima ternura */}
        <motion.g style={{ x: springX * 0.5, y: springY * 0.5 }}>
          <Ojo cx={38} cy={63} springX={springX} springY={springY} blink={blink} />
          <Ojo cx={62} cy={63} springX={springX} springY={springY} blink={blink} />

          {/* BOCA: Sonrisa o habla elástica */}
          <motion.g transform="translate(50, 78)">
            {isSpeaking ? (
              <motion.ellipse
                cx="0" cy="0" rx="5"
                animate={{ ry: Math.max(2, bocaScale * 9) }}
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