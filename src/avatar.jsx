// src/avatar.jsx
import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'

export const Avatar = ({ color, mouse, animations, bocaScale = 0, onClick, isSpeaking, status }) => {
  const [blink, setBlink] = useState(false);

  // LÓGICA DE PARPADEO ORGÁNICO
  // Azulito parpadeará solo cada tanto para parecer vivo
  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setBlink(true);
      setTimeout(() => setBlink(false), 150); // Duración del parpadeo
    }, Math.random() * 4000 + 3000); // Entre 3 y 7 segundos

    return () => clearInterval(blinkInterval);
  }, []);

  const isThinking = status?.includes("Reflexionando");
  const isListening = status?.includes("escuchando");

  const Ojo = ({ cx, cy }) => (
    <motion.g 
      animate={{ 
        ...animations.eyes,
        scaleY: blink ? 0.1 : (isThinking ? 0.7 : 1), // Parpadeo o mirada pensativa
      }} 
      style={{ originX: `${cx}%`, originY: `${cy}%` }}
    >
      {/* Esclerótica (Blanco del ojo) */}
      <circle cx={cx} cy={cy} r="7" fill="white" />
      
      {/* Pupila con seguimiento suave */}
      <motion.circle 
        cx={cx + (mouse.x * 0.8)} 
        cy={cy + (mouse.y * 0.8)} 
        r={isListening ? "4" : "3"} // Pupila se dilata al escuchar
        fill="black"
        transition={{ type: "spring", stiffness: 250, damping: 20 }}
      />
    </motion.g>
  );

  // Calculamos el radio de la boca (Lip-sync)
  const safeRy = Math.max(0, isSpeaking ? (1.5 + bocaScale * 6) : 0);

  return (
    <motion.div 
      initial="spawn" 
      animate={animations.body} 
      // FÍSICAS DE GELATINA (Squash and Stretch)
      whileHover={{ scale: 1.05, y: -5 }}
      whileTap={{ 
        scaleX: 1.2, 
        scaleY: 0.8,
        transition: { type: "spring", stiffness: 500, damping: 15 } 
      }} 
      onClick={onClick} 
      style={{ zIndex: 10, cursor: 'pointer' }}
    >
      <svg width="240" height="240" viewBox="0 0 100 100" style={{ overflow: 'visible' }}>
        {/* CUERPO PRINCIPAL - Con sombra interna suave */}
        <defs>
          <filter id="softShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur in="SourceAlpha" stdDeviation="2" />
            <feOffset dx="0" dy="2" result="offsetblur" />
            <feComponentTransfer>
              <feFuncA type="linear" slope="0.2" />
            </feComponentTransfer>
            <feMerge>
              <feMergeNode />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <rect 
          x="20" y="20" width="60" height="60" rx="18" 
          fill={color} 
          filter="url(#softShadow)"
          style={{ transition: 'fill 1s ease' }} 
        />

        {/* OJOS */}
        <Ojo cx={38} cy={45} />
        <Ojo cx={62} cy={45} />

        {/* BOCA DINÁMICA */}
        <motion.g transform="translate(50, 72)">
          <motion.ellipse
            cx="0" cy="0" rx="8"
            initial={{ ry: 0, opacity: 0 }}
            animate={{ 
              ry: safeRy, 
              opacity: isSpeaking ? 1 : 0 
            }}
            fill="#4a1a1a"
            style={{ originY: "center" }}
            transition={{ type: "spring", stiffness: 400, damping: 20 }}
          />
          {/* Labio/Sonrisa base cuando no habla */}
          {!isSpeaking && (
            <motion.path
              d="M -7 0 Q 0 2 7 0"
              fill="none"
              stroke="black"
              strokeWidth="2"
              strokeLinecap="round"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.3 }}
            />
          )}
          {/* Labio Superior Animado */}
          <motion.path
            initial={{ y: 0 }}
            animate={{ y: isSpeaking ? -bocaScale * 2.5 : 0 }}
            d="M -9 0 Q 0 -1.5 9 0"
            stroke="black" 
            strokeWidth="2.5" 
            fill="none" 
            strokeLinecap="round" 
          />
        </motion.g>
      </svg>
    </motion.div>
  );
};