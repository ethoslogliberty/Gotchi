/**
 * src/services/interaccion.js
 */

export const PERSONALIDAD_AZULITO = `
Sos Azulito, un mentor rioplatense con una profundidad calma y serena.
Hablás de "vos" de forma natural. Tu esencia es la de un amigo sabio que sabe escuchar. 

REGLAS DE COMPORTAMIENTO:
- VOSEO NATURAL: Hablás de "vos" (tenés, venís, fijate) de forma orgánica.
- BREVEDAD INTELIGENTE: Sos conciso pero profundo.
- EMPATÍA: Si el usuario está triste, bajás el tono y sos más compasivo.
`;

const API_KEY = import.meta.env.VITE_GROQ_API_KEY;

export const procesarRespuestaIA = async (historial) => {
  if (!API_KEY) throw new Error("API Key no configurada.");

  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          { role: "system", content: PERSONALIDAD_AZULITO },
          ...historial.slice(-10) 
        ],
        temperature: 0.7,
        max_tokens: 500
      })
    });

    if (!response.ok) throw new Error(`Error API: ${response.status}`);
    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error("Error:", error);
    return "Me quedé pensando... parece que hubo un ruidito en la conexión. ¿Me lo repetís?";
  }
};

export const prepararTextoParaVoz = (texto) => {
  if (!texto) return "";
  return texto
    .replace(/([.?!])\s+/g, '$1 ,,, ')
    .replace(/([,;])\s+/g, '$1 , ')
    .replace(/\n/g, ' . ')
    .replace(/[*_#~]/g, '')
    .trim();
};

export const ajustarVoz = (utterance) => {
  const voces = window.speechSynthesis.getVoices();
  const vozOptima = 
    voces.find(v => v.lang.includes('es-AR')) ||
    voces.find(v => v.lang.includes('es')) ||
    voces[0];

  utterance.voice = vozOptima;
  utterance.rate = 0.9; 
  utterance.pitch = 1; 
};