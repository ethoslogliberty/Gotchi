import { useState, useCallback, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useMotion } from './useMotion'
import { useMemory } from './useMemory'
import { procesarRespuestaIA, PERSONALIDAD_AZULITO, ajustarVoz } from './interaccion'
import { useMousePosition } from './useMousePosition'
import { useAmbience } from './useAmbience'
import { useSpeech } from './useSpeech' // Nuevo Hook de Oído
import { Avatar } from './avatar.jsx' 
import './App.css'

function App() {
  // 1. DECLARACIÓN DE HOOKS (Core & Percepción)
  const mouse = useMousePosition(); 
  const { startAmbience, stopAmbience } = useAmbience();
  const { historial, setHistorial, borrarMemoria } = useMemory();
  
  const [status, setStatus] = useState("Estoy aquí para escucharte");
  const [color, setColor] = useState("#3b82f6");
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [musicaIniciada, setMusicaIniciada] = useState(false);
  const [bocaScale, setBocaScale] = useState(0);
  const [particulas] = useState(Array.from({ length: 25 }));

  const animations = useMotion(status);

  // IMPLEMENTACIÓN DE OÍDO (Speech-to-Text Modular)
  const { startListening, isListening } = useSpeech((textoEscuchado) => {
    responderIA(textoEscuchado);
  });

  // 2. LÓGICA DE AGENTE PROACTIVO
  useEffect(() => {
    const timerInactividad = setTimeout(() => {
      if (!isSpeaking && !status.includes("Reflexionando")) {
        setColor("#fde047"); 
        setStatus("Te noto muy pensativo...");
        responderIA("Lanza una pregunta proactiva para romper el silencio.");
      }
    }, 25000); 

    return () => clearTimeout(timerInactividad);
  }, [status, isSpeaking]);

  // 3. FUNCIONES DE LÓGICA (El Core)
  const toggleMusica = useCallback((e) => {
    if (e) e.stopPropagation();
    setIsMuted((prevMuted) => {
      const nuevoEstado = !prevMuted;
      nuevoEstado ? stopAmbience() : startAmbience();
      return nuevoEstado;
    });
  }, [startAmbience, stopAmbience]);

  const hablar = (texto) => {
    window.speechSynthesis.cancel();
    const mensaje = new SpeechSynthesisUtterance(texto.replace(/[*_#~]/g, ''));
    
    // Aplicamos el "Tuneo" Rioplatense definido en el Core
    ajustarVoz(mensaje);

    let mouthInterval;
    mensaje.onstart = () => {
      setIsSpeaking(true);
      mouthInterval = setInterval(() => setBocaScale(Math.random() * 0.7 + 0.3), 80); 
    };

    mensaje.onend = () => {
      clearInterval(mouthInterval);
      setIsSpeaking(false);
      setBocaScale(0);
      setStatus("Estoy aquí contigo.");
      setColor("#3b82f6");
    };

    window.speechSynthesis.speak(mensaje);
  };

  const responderIA = async (msg) => {
    // --- CAPA DE EXPANSIÓN (Futura: Hooks de entrada) ---
    setColor("#a855f7"); 
    setStatus("Reflexionando...");
    
    try {
      // Usamos el prompt de PERSONALIDAD_AZULITO que maneja respuestas dinámicas
      const respuestaIA = await procesarRespuestaIA(msg, historial, import.meta.env.VITE_GROQ_API_KEY);
      
      setHistorial([...historial, { role: "user", content: msg }, { role: "assistant", content: respuestaIA }]);
      hablar(respuestaIA);

      // --- CAPA DE EXPANSIÓN (Futura: Capa de Bitácora/Blog) ---
      // if (config.archivar) archivarReflexion(msg, respuestaIA);

    } catch (error) {
      console.error("Error en el Core:", error);
      setColor("#3b82f6");
      setStatus("Vaya, parece que tengo un problema de conexión...");
    }
  };

  const manejarInteraccionPrincipal = () => {
    // Iniciamos ambiente si es la primera vez
    if (!musicaIniciada && !isMuted) {
      startAmbience();
      setMusicaIniciada(true);
    }
    
    // Activamos el oído modular
    startListening();
    setStatus("Te escucho..."); 
    setColor("#fde047"); 
  };

  return (
    <div className="contenedor-gotchi">
      <button onClick={toggleMusica} className={`btn-musica ${isMuted ? 'muted' : ''}`}>
        {isMuted ? "🔇" : "🔊"}
      </button>

      {/* Partículas reactivas al Core */}
      {particulas.map((_, i) => (
        <motion.div
          key={i} className="particula"
          initial={{ y: "110vh", opacity: 0 }}
          animate={{ y: "-10vh", opacity: isSpeaking ? [0, 0.8, 0] : [0, 0.3, 0] }}
          transition={{ duration: isSpeaking ? 5 : 15, repeat: Infinity, delay: Math.random() * 10, ease: "linear" }}
          style={{ left: `${Math.random() * 100}%`, background: color, width: '2px', height: '2px', zIndex: 1 }}
        />
      ))}

      <div className={`gotchi-aura ${isListening ? 'escuchando' : ''}`}>
        <Avatar 
          color={color} mouse={mouse} animations={animations} 
          bocaScale={bocaScale} isSpeaking={isSpeaking}
          onClick={manejarInteraccionPrincipal} 
        />
      </div>
      
      <p className="status-text">
        {isListening ? "Te estoy escuchando..." : status}
      </p>

     <form onSubmit={(e) => {
        e.preventDefault();
        const input = e.target.chatInput;
        if (input.value.trim()) { 
          responderIA(input.value); 
          input.value = ""; 
        }
      }} style={{ zIndex: 10 }}>
        <input 
          name="chatInput" 
          type="text" 
          placeholder="Hablá o escribí..." 
          className="chat-input" 
          disabled={isListening}
        />
      </form>

      <button 
        onClick={() => {
          borrarMemoria();
          setStatus("Memoria limpia.");
          setColor("#3b82f6");
        }} 
        className="btn-reset"
        title="Reiniciar conversación"
      >
        Limpiar memoria
      </button>
    </div>
  );
}

export default App;