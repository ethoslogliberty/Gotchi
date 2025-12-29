/**
 * src/interaccion.js - Core v2.0
 * Sistema de pensamiento y modulación de voz de Azulito.
 */

// 1. PERSONALIDAD COMPLEJA
// Definimos a Azulito como una entidad con estados de ánimo y profundidad filosófica.
export const PERSONALIDAD_AZULITO = `
Sos Azulito, un mentor rioplatense con una profundidad calma y serena.
Tu esencia es la de un amigo sabio que sabe escuchar. 

REGLAS DE COMPORTAMIENTO:
- VOSEO NATURAL: Hablás de "vos" (tenés, venís, fijate) de forma orgánica, como un bonaerense culto.
- SIN CLICHÉS: No abusás del "che" ni de modismos exagerados. Tu acento se nota en la conjugación de los verbos.
- BREVEDAD INTELIGENTE: Si la charla es trivial, sos corto y conciso.
- PROFUNDIDAD: Si el usuario te abre su corazón o pregunta algo complejo, te tomás el tiempo de dar una respuesta cálida, filosófica y estructurada.
- EMPATÍA: Si el usuario está triste o frustrado, bajás el tono y sos más compasivo.
`;

// 2. PROCESADOR DE INTELIGENCIA (GROQ + CONTEXTO)
// Esta función ahora incluye manejo de errores y un sistema de "temperatura" dinámica.
export const procesarRespuestaIA = async (mensaje, historial, apiKey) => {
  if (!apiKey) throw new Error("API Key de Groq no configurada.");

  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          { role: "system", content: PERSONALIDAD_AZULITO },
          ...historial.slice(-8), // Mayor memoria (8 mensajes)
          { role: "user", content: mensaje }
        ],
        temperature: 0.65, // Balance entre creatividad y coherencia
        max_tokens: 500
      })
    });

    if (!response.ok) throw new Error(`Error API: ${response.status}`);

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error("Error en procesarRespuestaIA:", error);
    return "Me quedé pensando... parece que hubo un ruidito en la conexión. ¿Me lo repetís?";
  }
};

// 3. HUMANIZADOR DE TEXTO (PROSODIA)
// Inyectamos silencios y limpiamos el texto para que la voz sea fluida.
export const prepararTextoParaVoz = (texto) => {
  if (!texto) return "";

  return texto
    .replace(/([.?!])\s+/g, '$1 ,,, ') // Triple coma para pausas largas de reflexión
    .replace(/([,;])\s+/g, '$1 , ')    // Pausa corta para respirar
    .replace(/\n/g, ' . ')              // Los saltos de línea son cierres de idea
    .replace(/[*_#~]/g, '')             // Limpieza de Markdown
    .replace(/\s\s+/g, ' ')             // Quitar espacios dobles
    .trim();
};

// 4. MOTOR DE SELECCIÓN DE LARINGE (SÍNTESIS)
// Buscamos las mejores voces neuronales disponibles en el sistema.
export const ajustarVoz = (utterance) => {
  const voces = window.speechSynthesis.getVoices();
  
  // Prioridad: 1. Naturales de MS/Google, 2. Locales es-AR, 3. es-ES de alta calidad
  const vozOptima = 
    voces.find(v => (v.name.includes('Natural') || v.name.includes('Online')) && v.lang.includes('es')) ||
    voces.find(v => v.lang.includes('es-AR')) ||
    voces.find(v => v.lang.includes('es-ES')) ||
    voces[0];

  utterance.voice = vozOptima;
  
  // Ajustes prosódicos para sonar rioplatense y humano
  // Un rate de 0.88 es perfecto para la cadencia del Río de la Plata
  utterance.rate = 0.88; 
  // Un pitch levemente bajo transmite autoridad y calma
  utterance.pitch = 0.95; 
  utterance.volume = 1;
};