import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

function App() {
  const [bocaPath, setBocaPath] = useState("M 40 65 Q 50 75 60 65"); 
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [status, setStatus] = useState("Tócame para hablar");
  const [color, setColor] = useState("#3b82f6"); // Azul Gotchi

  // --- LÓGICA DE VOZ (OÍDO) ---
  const oido = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
  oido.lang = 'es-ES';

  const escuchar = () => {
    try {
      oido.start();
      setStatus("Te escucho...");
      setColor("#fde047");
    } catch (e) { console.log("Ya escuchando"); }
  };

  oido.onresult = (event) => {
    const texto = event.results[0][0].transcript;
    responderIA(texto);
  };

  // --- LÓGICA DE IA (GROQ) ---
  const responderIA = async (msg) => {
    setStatus("Pensando...");
    setColor("#3b82f6");
    
    // REEMPLAZA ESTO CON TU API KEY REAL
    const API_KEY = import.meta.env.VITE_GROQ_API_KEY;
    try {
      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          messages: [
            {
              role: "system",
              content: "Eres un Tamagotchi azul que flota. Eres tierno pero ácido. Responde en español, muy corto (máximo 12 palabras)."
            },
            { role: "user", content: msg }
          ],
        }),
      });
      
      const data = await response.json();
      const textoIA = data.choices[0].message.content;

      setIsSpeaking(true);
      setStatus("Hablando...");
      
      const voz = new SpeechSynthesisUtterance(textoIA);
      voz.lang = 'es-ES';
      voz.onend = () => {
        setIsSpeaking(false);
        setStatus("Tócame o escríbeme");
      };
      window.speechSynthesis.speak(voz);

    } catch (error) {
      console.error(error);
      setStatus("Error de conexión");
    }
  };

  // --- ANIMACIÓN DE BOCA ---
  useEffect(() => {
    if (isSpeaking) {
      const interval = setInterval(() => {
        const shapes = [
          "M 40 65 Q 50 85 60 65", 
          "M 40 70 Q 50 70 60 70", 
          "M 45 65 A 5 5 0 1 0 55 65 A 5 5 0 1 0 45 65"
        ];
        setBocaPath(shapes[Math.floor(Math.random() * shapes.length)]);
      }, 150);
      return () => clearInterval(interval);
    } else {
      setBocaPath("M 40 65 Q 50 75 60 65");
    }
  }, [isSpeaking]);

  return (
    <div style={{ textAlign: 'center', padding: '20px' }}>
      <motion.div
        animate={{ y: [0, -15, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        onClick={escuchar}
      >
        <svg width="220" height="220" viewBox="0 0 100 100">
          <rect x="20" y="20" width="60" height="60" rx="15" fill={color} />
          <motion.g animate={{ scaleY: [1, 1, 0.1, 1] }} transition={{ repeat: Infinity, dur: 4, times: [0, 0.9, 0.95, 1] }}>
            <circle cx="35" cy="45" r="5" fill="black" />
            <circle cx="65" cy="45" r="5" fill="black" />
          </motion.g>
          <path d={bocaPath} stroke="black" strokeWidth="2" fill="none" strokeLinecap="round" />
        </svg>
      </motion.div>
      
      <p style={{ color: 'white', opacity: 0.7 }}>{status}</p>

      <form 
        onSubmit={(e) => {
          e.preventDefault();
          const input = e.target.elements.chatInput;
          if (input.value.trim()) {
            responderIA(input.value);
            input.value = "";
          }
        }}
      >
        <input 
          name="chatInput"
          type="text" 
          placeholder="Escríbele algo..." 
          style={{
            padding: '12px',
            borderRadius: '20px',
            border: '1px solid #3b82f6',
            backgroundColor: '#1a1a1a',
            color: 'white',
            width: '200px',
            textAlign: 'center'
          }}
        />
      </form>
    </div>
  );
} // <--- AQUÍ CIERRA LA FUNCIÓN APP

export default App; // <--- EL EXPORT AHORA ESTÁ AFUERA