// src/avatar.jsx
import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'

export const Avatar = ({ color, mouse, animations, bocaScale = 0, onClick, isSpeaking, status }) => {
  const [blink, setBlink] = useState(false);

  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setBlink(true);
      setTimeout(() => setBlink(false), 150);
    }, Math.random() * 4000 + 3000);
    return () => clearInterval(blinkInterval);
  }, []);

  const isThinking = status?.includes("Reflexionando");
  
  // Esta es la clave: Un PATH orgánico en lugar de un RECTÁNGULO
  // Imaginalo como una "gota" que cambia de forma
  const blobPath = "M25,30 Q50,20 75,30 Q85,50 75,70 Q50,85 25,70 Q15,50 25,30 Z";

  const Ojo = ({ cx, cy }) => (
    <motion.g 
      animate={{ 
        scaleY: blink ? 0.1 : (isThinking ? 0.7 : 1),
      }} 
      style={{ originX: `${cx}%`, originY: `${cy}%` }}
    >
      <circle cx={cx} cy={cy} r="6" fill="white" />
      <motion.circle 
        cx={cx + (mouse.x * 0.7)} 
        cy={cy + (mouse.y * 0.7)} 
        r="2.5" 
        fill="black"
        transition={{ type: "spring", stiffness: 250, damping: 20 }}
      />
    </motion.g>
  );

  const safeRy = Math.max(0, isSpeaking ? (1.5 + bocaScale * 6) : 0);

  return (
    <motion.div 
      animate={{
        // Efecto de respiración sutil en todo el cuerpo
        scale: [1, 1.02, 1],
      }}
      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9, rotate: [0, -5, 5, 0] }}
      onClick={onClick} 
      style={{ zIndex: 10, cursor: 'pointer' }}
    >
      <svg width="250" height="250" viewBox="0 0 100 100" style={{ overflow: 'visible' }}>
        <defs>
          <filter id="glow">
            <feGaussianBlur stdDeviation="2.5" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        {/* CUERPO ORGÁNICO (BLOB) */}
        <motion.path
          d={blobPath}
          fill={color}
          filter="url(#glow)"
          animate={{
            // El cuerpo se deforma levemente como si fuera líquido
            d: isSpeaking 
               ? "M25,35 Q50,25 75,35 Q80,50 75,65 Q50,80 25,65 Q20,50 25,35 Z" 
               : blobPath
          }}
          style={{ transition: 'fill 1s ease' }}
        />

        <Ojo cx={40} cy={45} />
        <Ojo cx={60} cy={45} />

        <motion.g transform="translate(50, 70)">
          <motion.ellipse
            cx="0" cy="0" rx="7"
            animate={{ ry: safeRy, opacity: isSpeaking ? 1 : 0 }}
            fill="#331111"
          />
          {!isSpeaking && (
            <path d="M -5 0 Q 0 2 5 0" fill="none" stroke="black" strokeWidth="1.5" opacity="0.4" />
          )}
        </motion.g>
      </svg>
    </motion.div>
  );
};