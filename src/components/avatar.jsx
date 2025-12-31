// src/components/avatar.jsx
import { useState, useEffect, memo, useRef } from 'react'

// Sub-componente Ojo: Maneja la lógica física y visual de la mirada
const Ojo = memo(({ cx, cy, pupilX, pupilY, blink }) => {
  // Límite físico para que la pupila no se escape del globo ocular
  const MAX_EYE_MOVE = 3.5;

  // Limitar el movimiento de las pupilas
  const distance = Math.sqrt(pupilX * pupilX + pupilY * pupilY);
  let finalPupilX, finalPupilY;

  if (distance <= MAX_EYE_MOVE) {
    finalPupilX = pupilX;
    finalPupilY = pupilY;
  } else {
    finalPupilX = (pupilX / distance) * MAX_EYE_MOVE;
    finalPupilY = (pupilY / distance) * MAX_EYE_MOVE;
  }

  // Efecto de profundidad: el blanco del ojo se mueve un 30% de lo que se mueve la pupila
  const eyeX = finalPupilX * 0.3;
  const eyeY = finalPupilY * 0.3;

  // Brillo de la pupila: se mueve un poco más para dar efecto vítreo
  const brilloX = finalPupilX * 1.2;
  const brilloY = finalPupilY * 1.2;

  // ID único para el clipPath (importante para que no choquen los ojos)
  const clipId = `eye-clip-${cx.toString().replace('.', '')}`;

  return (
    <g
      style={{
        transform: `translate(${eyeX}px, ${eyeY}px)`,
        transformOrigin: `${cx}% ${cy}%`,
        transition: 'transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)'
      }}
    >
      <defs>
        <clipPath id={clipId}>
          <circle cx={cx} cy={cy} r="8.5" />
        </clipPath>
      </defs>
      <circle cx={cx} cy={cy} r="8.5" fill="#FFFFFF" style={{ overflow: 'hidden' }} />
      <g clipPath={`url(#${clipId})`} style={{ overflow: 'hidden' }}>
        <circle
          cx={cx} cy={cy} r="4.5" fill="#000000"
          style={{
            transform: `translate(${finalPupilX}px, ${finalPupilY}px)`,
            transition: 'transform 0.2s ease-out',
            margin: 0,
            padding: 0
          }}
        />
        <circle
          cx={cx - 2.5} cy={cy - 2.5} r="2" fill="#FFFFFF"
          style={{
            transform: `translate(${brilloX}px, ${brilloY}px)`,
            transition: 'transform 0.2s ease-out',
            margin: 0,
            padding: 0
          }}
        />
      </g>
    </g>
  );
});

export const Avatar = ({ color, mouse, animations, bocaScale = 0, onClick, isSpeaking, status }) => {
  const [blink, setBlink] = useState(false);
  const [pupilX, setPupilX] = useState(0);
  const [pupilY, setPupilY] = useState(0);

  // --- PARPADEO SIMPLE CADA 5 SEGUNDOS ---
  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setBlink(true);
      setTimeout(() => setBlink(false), 150);
    }, 5000);

    return () => clearInterval(blinkInterval);
  }, []);

  // --- LÓGICA DE SEGUIMIENTO DIRECTO AL MOUSE ---
  useEffect(() => {
    const handleMouseMove = (e) => {
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;

      // Calcular posición relativa al centro
      const deltaX = e.clientX - centerX;
      const deltaY = e.clientY - centerY;

      // Normalizar y limitar el movimiento (rango pequeño para no salir de la esclerótica)
      const maxMovement = 5;
      const normalizedX = Math.max(-maxMovement, Math.min(maxMovement, deltaX / 50));
      const normalizedY = Math.max(-maxMovement, Math.min(maxMovement, deltaY / 50));

      setPupilX(normalizedX);
      setPupilY(normalizedY);
    };

    // --- TOQUE EN MÓVIL: movimiento único hacia el punto ---
    const handleTouchStart = (e) => {
      const touch = e.touches[0];
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;

      const deltaX = touch.clientX - centerX;
      const deltaY = touch.clientY - centerY;

      const maxMovement = 5;
      const normalizedX = Math.max(-maxMovement, Math.min(maxMovement, deltaX / 50));
      const normalizedY = Math.max(-maxMovement, Math.min(maxMovement, deltaY / 50));

      setPupilX(normalizedX);
      setPupilY(normalizedY);
    };

    // --- RETORNO AL CENTRO SUAVE ---
    const handleMouseLeave = () => {
      setPupilX(0);
      setPupilY(0);
    };

    // --- CENTRAR MIRADA AL INICIAR ---
    const resetToCenter = () => {
      setPupilX(0);
      setPupilY(0);
    };

    // Forzar centrado al montar
    resetToCenter();

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchstart', handleTouchStart);
    window.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  // --- LÓGICA DE SEGUIMIENTO Y NORMALIZACIÓN (para cara y cuerpo) ---
  const [faceTransform, setFaceTransform] = useState('translate(0px, 0px)');
  const [bodyTransform, setBodyTransform] = useState('translate(0px, 0px)');

  useEffect(() => {
    // Si no hay mouse o es la posición inicial (0,0), miramos al frente
    if (!mouse || (mouse.x === 0 && mouse.y === 0)) {
      setFaceTransform('translate(0px, 0px)');
      setBodyTransform('translate(0px, 0px)');
      return;
    }

    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;

    // Normalizamos el valor a un rango manejable para el SVG
    const moveX = (mouse.x - centerX) / (window.innerWidth / 2);
    const moveY = (mouse.y - centerY) / (window.innerHeight / 2);

    const faceX = moveX * 15 * 0.4;
    const faceY = moveY * 15 * 0.4;
    const bodyX = faceX * 0.3;
    const bodyY = faceY * 0.3;

    setFaceTransform(`translate(${faceX}px, ${faceY}px)`);
    setBodyTransform(`translate(${bodyX}px, ${bodyY}px)`);
  }, [mouse]);

  return (
    <div onClick={onClick} style={{
      cursor: 'pointer',
      position: 'relative',
      background: 'none',
      border: 'none',
      outline: 'none',
      boxShadow: 'none'
    }} className="avatar-container">
      <svg width="280" height="280" viewBox="0 0 100 100" style={{ overflow: 'visible', filter: 'none', opacity: 1 }}>
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
          <circle
            cx="50" cy="65"
            r={30}
            className={isSpeaking ? 'speaking' : 'idle'}
          />
          <circle cx="35" cy="70" r="22" style={{ transform: bodyTransform, transition: 'transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)' }} />
          <circle cx="65" cy="70" r="22" style={{ transform: bodyTransform, transition: 'transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)' }} />
        </g>

        {/* Cara: Ojos y Boca centrados en un grupo que sigue al mouse */}
        <g style={{ transform: faceTransform, transition: 'transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)' }}>
          <Ojo cx={38} cy={64} pupilX={pupilX} pupilY={pupilY} blink={blink} />
          <Ojo cx={62} cy={64} pupilX={pupilX} pupilY={pupilY} blink={blink} />

          {/* Boca: Animación CSS pura */}
          <g transform="translate(50, 78)">
            {isSpeaking ? (
              <ellipse
                cx="0" cy="0" rx="6"
                ry={5}
                className="speaking-mouth"
                style={{ transform: `scaleY(${Math.max(0.1, 0.2 + (bocaScale * 1.8))})`, transition: 'transform 0.1s ease-out' }}
                fill="#331111"
              />
            ) : (
              <path
                d="M -5 0 Q 0 4 5 0"
                fill="none" stroke="black" strokeWidth="2.5"
                strokeLinecap="round" opacity="0.7"
                className="idle-mouth"
              />
            )}
          </g>
        </g>
      </svg>
    </div>
  );
};