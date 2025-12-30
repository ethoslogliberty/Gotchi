// src/avatar.jsx - VERSIÓN "LÍMITES SEGUROS" (Anti-desvío de ojos)
import { motion, useSpring, useTransform } from 'framer-motion'
import { useState, useEffect, memo } from 'react'

const Ojo = memo(({ cx, cy, springX, springY, blink }) => {
  // --- LÓGICA DE LÍMITE PARA LAS PUPILAS ---
  const MAX_EYE_MOVE = 3.5; // Máximo que puede moverse la pupila dentro del ojo

  const pupilX = useTransform(springX, (v) => {
    const x = v * 0.5;
    const y = springY.get() * 0.5;
    const distance = Math.sqrt(x * x + y * y);
    if (distance <= MAX_EYE_MOVE) return x;
    return (x / distance) * MAX_EYE_MOVE;
  });

  const pupilY = useTransform(springY, (v) => {
    const x = springX.get() * 0.5;
    const y = v * 0.5;
    const distance = Math.sqrt(x * x + y * y);
    if (distance <= MAX_EYE_MOVE) return y;
    return (y / distance) * MAX_EYE_MOVE;
  });

  const eyeX = useTransform(pupilX, (v) => v * 0.3);
  const eyeY = useTransform(pupilY, (v) => v * 0.3);
  const brilloX = useTransform(pupilX, (v) => v * 1.2);
  const brilloY = useTransform(pupilY, (v) => v * 1.2);

  const clipId = `eye-clip-${cx.toString().replace('.', '')}`;

  return (
    <motion.g 
      style={{ x: eyeX, y: eyeY, originX: `${cx}%`, originY: `${cy}%` }}
      animate={{ scaleY: blink ? 0 : 1 }}
      transition={{ duration: 0.08 }}
    >
      <defs>
        <clipPath id={clipId}>
          <circle cx={cx} cy={cy} r="8.5" />
        </clipPath>
      </defs>
      <circle cx={cx} cy={cy} r="8.5" fill="white" /> 
      <g clipPath={`url(#${clipId})`}>
        <motion.circle 
          cx={cx} cy={cy} r="4.5" fill="black"
          style={{ x: pupilX, y: pupilY }} 
        />
        <motion.circle 
          cx={cx - 2.5} cy={cy - 2.5} r="2" fill="white"
          style={{ x: brilloX, y: brilloY }} 
        />
      </g>
    </motion.g>
  );
});

export const Avatar = ({ color, mouse, animations, bocaScale = 0, onClick, isSpeaking, status }) => {
  const [blink, setBlink] = useState(false);

  const springConfig = { stiffness: 180, damping: 15, mass: 0.5 };
  const springX = useSpring(0, springConfig);
  const springY = useSpring(0, springConfig);

  // --- LÓGICA DE LÍMITE PARA LA CARA ---
  const MAX_FACE_MOVE = 7; // El límite del "eje" del rostro

  const faceX = useTransform(springX, (v) => {
    const x = v * 0.4;
    const y = springY.get() * 0.4;
    const distance = Math.sqrt(x * x + y * y);
    if (distance <= MAX_FACE_MOVE) return x;
    return (x / distance) * MAX_FACE_MOVE;
  });

  const faceY = useTransform(springY, (v) => {
    const x = springX.get() * 0.4;
    const y = v * 0.4;
    const distance = Math.sqrt(x * x + y * y);
    if (distance <= MAX_FACE_MOVE) return y;
    return (y / distance) * MAX_FACE_MOVE;
  });

  const bodyX = useTransform(faceX, (v) => v * 0.3);
  const bodyY = useTransform(faceY, (v) => v * 0.3);

  useEffect(() => {
    springX.set((mouse.x || 0) * 15); 
    springY.set((mouse.y || 0) * 15);
  }, [mouse.x, mouse.y, springX, springY]);

  useEffect(() => {
    const loop = () => {
      const randomTime = 2000 + Math.random() * 3000;
      const timeout = setTimeout(() => {
        setBlink(true);
        setTimeout(() => {
          setBlink(false);
          loop();
        }, 100);
      }, randomTime);
      return timeout;
    };
    const mainTimeout = loop();
    return () => clearTimeout(mainTimeout);
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

        <g style={{ filter: 'url(#gooey-final-kawaii)' }} fill={color}>
          <motion.circle
            cx="50" cy="65"
            animate={{ r: isSpeaking ? [31, 33, 31] : [30, 31, 30] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <motion.circle cx="35" cy="70" r="22" style={{ x: bodyX, y: bodyY }} />
          <motion.circle cx="65" cy="70" r="22" style={{ x: bodyX, y: bodyY }} />
        </g>

        <motion.g style={{ x: faceX, y: faceY }}>
          <Ojo cx={38} cy={64} springX={springX} springY={springY} blink={blink} />
          <Ojo cx={62} cy={64} springX={springX} springY={springY} blink={blink} />

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