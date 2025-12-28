// src/avatar.jsx
import { motion } from 'framer-motion'

export const Avatar = ({ color, mouse, animations, bocaScale = 0, onClick, isSpeaking }) => {
  const Ojo = ({ cx, cy }) => (
    <motion.g animate={animations.eyes} style={{ originX: `${cx}%`, originY: `${cy}%` }}>
      <circle cx={cx} cy={cy} r="7" fill="white" />
      <motion.circle 
        cx={cx + (mouse.x * 0.6)} cy={cy + (mouse.y * 0.6)} r="3" fill="black"
        transition={{ type: "spring", stiffness: 200, damping: 25 }}
      />
    </motion.g>
  );

  // Calculamos el radio de la boca de forma segura
  const safeRy = Math.max(0, isSpeaking ? (1.5 + bocaScale * 5.5) : 0);

  return (
    <motion.div initial="spawn" animate={animations.body} whileHover={animations.hover}
      whileTap={animations.tap} onClick={onClick} style={{ zIndex: 10, cursor: 'pointer' }}>
      <svg width="240" height="240" viewBox="0 0 100 100" style={{ overflow: 'visible' }}>
        <rect x="20" y="20" width="60" height="60" rx="18" fill={color} style={{ transition: '1s' }} />
        <Ojo cx={38} cy={45} /><Ojo cx={62} cy={45} />

        <motion.g transform="translate(50, 72)">
          {/* Fondo de la boca con protección contra negativos */}
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
          {/* Labio Superior */}
          <motion.path
            initial={{ y: 0 }}
            animate={{ y: isSpeaking ? -bocaScale * 2 : 0 }}
            d="M -9 0 Q 0 -1.5 9 0"
            stroke="black" strokeWidth="2.5" fill="none" strokeLinecap="round"
          />
          {/* Labio Inferior */}
          <motion.path
            initial={{ y: 0 }}
            animate={{ y: isSpeaking ? bocaScale * 4 : 0 }}
            d="M -9 0 Q 0 2.5 9 0"
            stroke="black" strokeWidth="2.5" fill="none" strokeLinecap="round"
          />
        </motion.g>
      </svg>
    </motion.div>
  );
};