// src/App.jsx
import { useState, useEffect, useRef, useMemo } from 'react'

// 1. IMPORTACIONES DE HOOKS
import { useMemory } from './hooks/useMemory'
import { useMotion } from './hooks/useMotion'
import { useMousePosition } from './hooks/useMousePosition'
import { useAmbience } from './hooks/useAmbience'
import { useSpeech } from './hooks/useSpeech'

// 2. IMPORTACIONES DE COMPONENTES
import { Avatar } from './components/avatar.jsx'

// 3. IMPORTACIONES DE PLUGINS
import { DiarioPlugin } from './plugins/DiarioPlugin'

// 4. IMPORTACIONES DE SERVICIOS
import {
  procesarRespuestaIA,
  prepararTextoParaVoz,
  ajustarVoz
} from './services/interaccion'

import './App.css'

function App() {
  // --- ESTADOS Y HOOKS ---
  const mouse = useMousePosition();
  const { startAmbience, stopAmbience } = useAmbience();
  const { historial, setHistorial, borrarMemoria } = useMemory();

  const [status, setStatus] = useState("Estoy aquí para escucharte");
  const [color] = useState("#3b82f6");
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [bocaScale, setBocaScale] = useState(0);
  const [musicaIniciada, setMusicaIniciada] = useState(false);

  const animations = useMotion(status);
  const intervalRef = useRef(null); // Referencia segura para evitar colisiones de memoria

  // --- MOTOR DE ANIMACIÓN DE BOCA (Anti-CSP y Seguro) ---
  useEffect(() => {
    if (isSpeaking) {
      // Usamos una función pura para evitar problemas de evaluación de scripts (CSP)
      intervalRef.current = setInterval(() => {
        setBocaScale(Math.random());
      }, 120);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      setBocaScale(0);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isSpeaking]);

  // --- CONTROL DE TEXTO SEGURO (Blindaje contra CSP) ---
  // Memorizamos y validamos que el texto sea siempre un String válido
  const textoAMostrar = useMemo(() => {
    const msg = isSpeaking ? "Azulito está hablando..." : status;
    return typeof msg === 'string' ? msg : "Azulito está listo";
  }, [isSpeaking, status]);

  // --- MOTOR DE VOZ ---
  const ejecutarVoz = (texto) => {
    window.speechSynthesis.cancel();
    const textoLimpio = prepararTextoParaVoz(texto);
    const utterance = new SpeechSynthesisUtterance(textoLimpio);

    ajustarVoz(utterance);

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => {
      setIsSpeaking(false);
      setStatus("Te escucho...");
    };
    utterance.onerror = () => {
      setIsSpeaking(false);
      setStatus("Hubo un error en mi voz");
    };

    window.speechSynthesis.speak(utterance);
  };

  // --- LÓGICA DE RESPUESTA IA ---
  const responderIA = async (mensajeUsuario) => {
    if (!mensajeUsuario.trim()) return;

    setStatus("Reflexionando...");
    const nuevoHistorial = [...historial, { role: "user", content: mensajeUsuario }];
    setHistorial(nuevoHistorial);

    try {
      const respuesta = await procesarRespuestaIA(nuevoHistorial);
      setHistorial(prev => [...prev, { role: "assistant", content: respuesta }]);
      ejecutarVoz(respuesta);
    } catch (error) {
      console.error("Error IA:", error);
      setStatus("No pude conectarme...");
      setIsSpeaking(false);
    }
  };

  // --- RECONOCIMIENTO DE VOZ (Sincronizado con startListening de useSpeech.js) ---
  const { isListening, startListening } = useSpeech((transcript) => {
    responderIA(transcript);
  });

  const manejarInteraccionPrincipal = () => {
    // Desbloqueo inicial de audio requerido por navegadores
    window.speechSynthesis.speak(new SpeechSynthesisUtterance(""));

    if (!musicaIniciada) {
      startAmbience();
      setMusicaIniciada(true);
    }

    // Llamamos a la función con el nombre correcto que devuelve tu hook
    if (typeof startListening === 'function') {
      startListening();
    }
  };

  return (
    <div className="contenedor-gotchi">

      {/* Avatar y Efecto de Aura */}
      <div className={`gotchi-aura ${isListening ? 'escuchando' : ''}`}>
        <Avatar
          color={color}
          mouse={mouse}
          animations={animations}
          bocaScale={bocaScale}
          isSpeaking={isSpeaking}
          status={status}
          onClick={manejarInteraccionPrincipal}
        />
      </div>

      {/* BLOQUE DE TEXTO CORREGIDO Y BLINDADO */}
      <div className={`status-text ${isListening ? 'visible' : 'hidden'}`}>
        {isListening ? "Te estoy escuchando..." : textoAMostrar}
      </div>

      {/* Input de Chat Manual */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const input = e.target.chatInput;
          if (input.value.trim()) {
            responderIA(input.value);
            input.value = "";
          }
        }}
        style={{ zIndex: 10 }}
      >
        <input
          name="chatInput"
          type="text"
          placeholder="Escribí un mensaje..."
          className="chat-input"
          disabled={isListening || isSpeaking}
          autoComplete="off"
        />
      </form>

      <button onClick={borrarMemoria} className="btn-reset">
        Reiniciar Memoria
      </button>

      <DiarioPlugin historial={historial} />
    </div>
  );
}

export default App;