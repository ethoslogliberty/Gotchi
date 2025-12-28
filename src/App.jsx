import { useState, useCallback, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useMotion } from './useMotion'
import { useMemory } from './useMemory'
import { procesarRespuestaIA } from './interaccion'
import { useMousePosition } from './useMousePosition'
import { useAmbience } from './useAmbience'
import { Avatar } from './avatar.jsx' 
import './App.css'

function App() {
  // 1. DECLARACIÓN DE TODOS LOS HOOKS
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

  // 2. LÓGICA DE AGENTE PROACTIVO (Reloj de iniciativa)
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

  // 3. FUNCIONES DE LÓGICA
  const toggleMusica = useCallback((e) => {
    if (e) e.stopPropagation();
    setIsMuted((prevMuted) => {
      const nuevoEstado = !prevMuted;
      nuevoEstado ? stopAmbience() : startAmbience();
      return nuevoEstado;
    });
  }, [startAmbience, stopAmbience]);

  const hablarConVozFemenina = (texto) => {
    window.speechSynthesis.cancel();
    const mensaje = new SpeechSynthesisUtterance(texto.replace(/[*_#~]/g, ''));
    
    // Configuración para España
    mensaje.lang = 'es-ES'; 

    const obtenerVozYHablar = () => {
      const voces = window.speechSynthesis.getVoices();
      
      // Buscamos específicamente voces de España. Google Español es la mejor.
      const vozIdeal = voces.find(v => v.lang === 'es-ES' || v.name.includes('Spain')) || 
                       voces.find(v => v.lang.includes('es'));

      if (vozIdeal) {
        mensaje.voice = vozIdeal;
      }

      mensaje.pitch = 1.0; 
      mensaje.rate = 1.0; // Velocidad normal para España

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

    if (window.speechSynthesis.getVoices().length === 0) {
      window.speechSynthesis.onvoiceschanged = obtenerVozYHablar;
    } else {
      obtenerVozYHablar();
    }
  };

  const responderIA = async (msg) => {
    setColor("#a855f7"); 
    setStatus("Reflexionando...");
    try {
      const respuestaIA = await procesarRespuestaIA(msg, historial, import.meta.env.VITE_GROQ_API_KEY);
      setHistorial([...historial, { role: "user", content: msg }, { role: "assistant", content: respuestaIA }]);
      hablarConVozFemenina(respuestaIA);
    } catch (error) {
      setColor("#3b82f6");
      setStatus("Vaya, parece que tengo un problema de conexión...");
    }
  };

  const manejarInteraccionPrincipal = () => {
    if (!musicaIniciada && !isMuted) {
      startAmbience();
      setMusicaIniciada(true);
    }
    const oido = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    
    // Configuramos el oído para que entienda el español de España
    oido.lang = 'es-ES'; 
    
    oido.onresult = (e) => responderIA(e.results[0][0].transcript);
    try { 
      oido.start(); 
      setStatus("Te escucho..."); 
      setColor("#fde047"); 
    } catch(e){}
  };

  return (
    <div className="contenedor-gotchi">
      <button onClick={toggleMusica} className={`btn-musica ${isMuted ? 'muted' : ''}`}>
        {isMuted ? "🔇" : "🔊"}
      </button>

      {particulas.map((_, i) => (
        <motion.div
          key={i} className="particula"
          initial={{ y: "110vh", opacity: 0 }}
          animate={{ y: "-10vh", opacity: isSpeaking ? [0, 0.8, 0] : [0, 0.3, 0] }}
          transition={{ duration: isSpeaking ? 5 : 15, repeat: Infinity, delay: Math.random() * 10, ease: "linear" }}
          style={{ left: `${Math.random() * 100}%`, background: color, width: '2px', height: '2px', zIndex: 1 }}
        />
      ))}

      <div className="gotchi-aura">
        <Avatar 
          color={color} mouse={mouse} animations={animations} 
          bocaScale={bocaScale} isSpeaking={isSpeaking}
          onClick={manejarInteraccionPrincipal} 
        />
      </div>
      
      <p style={{ color: 'white', opacity: 0.8, marginTop: '25px', zIndex: 10, textAlign: 'center', transition: '0.5s' }}>
        {status}
      </p>

     <form onSubmit={(e) => {
        e.preventDefault();
        const input = e.target.chatInput;
        if (input.value.trim()) { 
          responderIA(input.value); 
          input.value = ""; 
        }
      }} style={{ zIndex: 10 }}>
        <input name="chatInput" type="text" placeholder="Charlemos un rato..." className="chat-input" />
      </form>

      <button 
        onClick={() => {
          borrarMemoria();
          setStatus("Memoria limpia. Soy una página en blanco.");
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