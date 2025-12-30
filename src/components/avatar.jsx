// src/components/avatar.jsx
import { motion, useSpring, useTransform } from 'framer-motion'
import { useState, useEffect, memo } from 'react'

// Sub-componente Ojo: Maneja la lógica física y visual de la mirada
const Ojo = memo(({ cx, cy, springX, springY, blink }) => {
  // Límite físico para que la pupila no se escape del globo ocular
  const MAX_EYE_MOVE = 3.5; 

  // Transformación de X: Calcula la distancia para no exceder el límite circular
  const pupilX = useTransform(springX, (v) => {
    const x = v * 0.5;
    const y = springY.get() * 0.5;
    const distance = Math.sqrt(x * x + y * y);
    if (distance <= MAX_EYE_MOVE) return x;
    return (x / distance) * MAX_EYE_MOVE;
  });

  // Transformación de Y: Idem anterior para el eje vertical
  const pupilY = useTransform(springY, (v) => {
    const x = springX.get() * 0.5;
    const y = v * 0.5;
    const distance = Math.sqrt(x * x + y * y);
    if (distance <= MAX_EYE_MOVE) return y;
    return (y / distance) * MAX_EYE_MOVE;
  });

  // Efecto de profundidad: el blanco del ojo se mueve un 30% de lo que se mueve la pupila
  const eyeX = useTransform(pupilX, (v) => v * 0.3);
  const eyeY = useTransform(pupilY, (v) => v * 0.3);
  
  // Brillo de la pupila: se mueve un poco más para dar efecto vítreo
  const brilloX = useTransform(pupilX, (v) => v * 1.2);
  const brilloY = useTransform(pupilY, (v) => v * 1.2);

  // ID único para el clipPath (importante para que no choquen los ojos)
  const clipId = `eye-clip-${cx.toString().replace('.', '')}`;

  return (
    <motion.g 
      style={{ x: eyeX, y: eyeY, originX: `${cx}%`, originY: `${cy}%` }}
      animate={{ scaleY: blink ? 0.1 : 1 }}
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

  // Configuración de resortes (Springs): mass y damping controlan la "personalidad" del movimiento
  const springConfig = { stiffness: 100, damping: 20, mass: 1 };
  const springX = useSpring(0, springConfig);
  const springY = useSpring(0, springConfig);

  // --- LÓGICA DE SEGUIMIENTO Y NORMALIZACIÓN ---
  useEffect(() => {
    // Si no hay mouse o es la posición inicial (0,0), miramos al frente
    if (!mouse || (mouse.x === 0 && mouse.y === 0)) {
      springX.set(0);
      springY.set(0);
      return;
    }

    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    
    // Normalizamos el valor a un rango manejable para el SVG
    const moveX = (mouse.x - centerX) / (window.innerWidth / 2);
    const moveY = (mouse.y - centerY) / (window.innerHeight / 2);

    springX.set(moveX * 15); 
    springY.set(moveY * 15);
  }, [mouse, springX, springY]);

  // Ciclo de parpadeo aleatorio para que se vea "vivo"
  useEffect(() => {
    const loop = () => {
      const timeout = setTimeout(() => {
        setBlink(true);
        setTimeout(() => { setBlink(false); loop(); }, 120);
      }, 3000 + Math.random() * 3000);
      return timeout;
    };
    const mainTimeout = loop();
    return () => clearTimeout(mainTimeout);
  }, []);

  // Transformaciones para el efecto Parallax de la cara sobre el cuerpo
  const faceX = useTransform(springX, (v) => v * 0.4);
  const faceY = useTransform(springY, (v) => v * 0.4);
  const bodyX = useTransform(faceX, (v) => v * 0.3);
  const bodyY = useTransform(faceY, (v) => v * 0.3);

  return (
    <motion.div onClick={onClick} style={{ cursor: 'pointer', position: 'relative' }}>
      <svg width="280" height="280" viewBox="0 0 100 100" style={{ overflow: 'visible' }}>
        <defs>
          {/* Filtro Gooey: crea la ilusión de que los círculos se fusionan como líquido */}
          <filter id="gooey-final">
            <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur" />
            <feColorMatrix in="blur" mode="matrix" 
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 20 -10" result="goo" />
            <feComposite in="SourceGraphic" in2="goo" operator="atop" />
          </filter>
        </defs>

        {/* Cuerpo con efecto líquido */}
        <g style={{ filter: 'url(#gooey-final)' }} fill={color}>
          <motion.circle
            cx="50" cy="65" 
            r={30} 
            initial={{ r: 30 }} 
            animate={{ r: isSpeaking ? [31, 33, 31] : [30, 31, 30] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <motion.circle cx="35" cy="70" r="22" style={{ x: bodyX, y: bodyY }} />
          <motion.circle cx="65" cy="70" r="22" style={{ x: bodyX, y: bodyY }} />
        </g>

        {/* Cara: Ojos y Boca centrados en un grupo que sigue al mouse */}
        <motion.g style={{ x: faceX, y: faceY }}>
          <Ojo cx={38} cy={64} springX={springX} springY={springY} blink={blink} />
          <Ojo cx={62} cy={64} springX={springX} springY={springY} blink={blink} />

          {/* Boca: Animación Blindada contra Errores de SVG y CSP */}
          <motion.g transform="translate(50, 78)">
            {isSpeaking ? (
              <motion.ellipse
                cx="0" cy="0" rx="6" 
                ry={5} // Radio fijo
                initial={{ scaleY: 0.2 }} 
                animate={{ 
                  // Usamos scaleY porque el navegador NO permite ry negativo.
                  // Si el spring rebota bajo cero, la escala lo soporta, el ry crashea.
                  scaleY: Math.max(0.1, 0.2 + (bocaScale * 1.8)) 
                }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                fill="#331111"
              />
            ) : (
              <motion.path 
                d="M -5 0 Q 0 4 5 0" 
                fill="none" stroke="black" strokeWidth="2.5" 
                strokeLinecap="round" opacity="0.7"
                animate={animations?.mouth || {}}
              />
            )}
          </motion.g>
        </motion.g>
      </svg>
    </motion.div>
  );
};