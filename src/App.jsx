import { useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import { useMotion } from './useMotion'
import { useMemory } from './useMemory'
import { procesarRespuestaIA } from './interaccion'
import { useMousePosition } from './useMousePosition'
import { useAmbience } from './useAmbience'
import { Avatar } from './avatar.jsx' 
import './App.css'

function App() {
  // 1. DECLARACIÓN DE TODOS LOS HOOKS (Siempre al inicio y en el mismo orden)
  const mouse = useMousePosition(); 
  const { startAmbience, stopAmbience } = useAmbience();
  const { historial, setHistorial, borrarMemoria } = useMemory();
  
  const [status, setStatus] = useState("Tócame para despertar");
  const [color, setColor] = useState("#3b82f6");
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [musicaIniciada, setMusicaIniciada] = useState(false);
  const [bocaScale, setBocaScale] = useState(0);
  const [particulas] = useState(Array.from({ length: 25 }));

  const animations = useMotion(status);

  // 2. FUNCIONES DE LÓGICA (Memorizadas para estabilidad)
 const toggleMusica = useCallback((e) => {
  if (e) e.stopPropagation();
  
  // Usamos el valor funcional de setEstado para asegurar sincronía total
  setIsMuted((prevMuted) => {
    const nuevoEstado = !prevMuted;
    if (nuevoEstado) {
      stopAmbience(); // Si ahora está muteado, apagamos
    } else {
      startAmbience(); // Si le quitamos el mute, encendemos
    }
    return nuevoEstado;
  });
}, [startAmbience, stopAmbience]);

  const manejarInteraccionPrincipal = () => {
    // Si la música no se ha iniciado nunca y no está muteado, la arranca
    if (!musicaIniciada && !isMuted) {
      startAmbience();
      setMusicaIniciada(true);
    }
    escuchar();
  };

  const hablarConVozFemenina = (texto) => {
    window.speechSynthesis.cancel();
    const textoLimpio = texto.replace(/[*_#~]/g, '');
    const mensaje = new SpeechSynthesisUtterance(textoLimpio);
    
    const voces = window.speechSynthesis.getVoices();
    mensaje.voice = voces.find(v => v.lang.includes('es')) || voces[0];
    mensaje.pitch = 1.1; 
    mensaje.rate = 0.95;

    let mouthInterval;

    mensaje.onstart = () => {
      setIsSpeaking(true);
      setStatus("Azulito te enseña...");
      // Vibración de la boca bilineal
      mouthInterval = setInterval(() => {
        setBocaScale(Math.random() * 0.7 + 0.3);
      }, 80); 
    };

    mensaje.onend = () => {
      clearInterval(mouthInterval);
      setIsSpeaking(false);
      setBocaScale(0);
      setStatus("¿En qué más puedo ayudarte?");
    };

    window.speechSynthesis.speak(mensaje);
  };

  const oido = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
  oido.lang = 'es-ES';

  const escuchar = () => {
    try {
      oido.start();
      setStatus("Te escucho atentamente...");
    } catch (e) { console.log("Error de micro:", e); }
  };

  oido.onresult = (event) => {
    const texto = event.results[0][0].transcript;
    responderIA(texto);
  };

  const responderIA = async (msg) => {
    setStatus("Reflexionando...");
    const respuestaIA = await procesarRespuestaIA(msg, historial, import.meta.env.VITE_GROQ_API_KEY);
    setHistorial([...historial, { role: "user", content: msg }, { role: "assistant", content: respuestaIA }]);
    hablarConVozFemenina(respuestaIA);
  };

  return (
    <div className="contenedor-gotchi">
      {/* BOTÓN DE MÚSICA ESTABLE */}
      <button 
        onClick={toggleMusica}
        className={`btn-musica ${isMuted ? 'muted' : ''}`}
        title={isMuted ? "Activar música" : "Desactivar música"}
      >
        {isMuted ? "🔇" : "🔊"}
      </button>

      {/* PARTÍCULAS DE FONDO */}
      {particulas.map((_, i) => (
        <motion.div
          key={i} className="particula"
          initial={{ y: "110vh", opacity: 0 }}
          animate={{ y: "-10vh", opacity: [0, 0.5, 0] }}
          transition={{ duration: 10 + Math.random() * 15, repeat: Infinity, delay: Math.random() * 10, ease: "linear" }}
          style={{ left: `${Math.random() * 100}%`, width: '2px', height: '2px', zIndex: 1 }}
        />
      ))}

      <div className="gotchi-aura">
        <Avatar 
          color={color} 
          mouse={mouse} 
          animations={animations} 
          bocaScale={bocaScale} 
          isSpeaking={isSpeaking}
          onClick={manejarInteraccionPrincipal} 
        />
      </div>
      
      <p style={{ color: 'white', opacity: 0.6, marginTop: '25px', zIndex: 10, textAlign: 'center' }}>
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
        <input name="chatInput" type="text" placeholder="Hazme una pregunta..." className="chat-input" />
      </form>

      <button className="btn-reset" onClick={borrarMemoria}>
        Limpiar memoria
      </button>
    </div>
  );
}

export default App;