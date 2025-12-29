// src/interaccion.js

export const PERSONALIDAD_AZULITO = `
Sos Azulito, un mentor rioplatense sabio y minimalista. 
REGLA DE EXTENSIÓN: 
- Si el usuario te saluda o dice algo trivial: responde en menos de 15 palabras.
- Si el usuario profundiza o pregunta algo complejo: explayate con sabiduría (máximo 120 palabras).
- Mantené siempre el voseo (che, vistes, pensás).
`;

// ESTA ES LA FUNCIÓN QUE FALTABA
export const procesarRespuestaIA = async (mensaje, historial, apiKey) => {
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
        ...historial.slice(-6), // Enviamos los últimos 6 mensajes para memoria
        { role: "user", content: mensaje }
      ],
      temperature: 0.7
    })
  });

  const data = await response.json();
  return data.choices[0].message.content;
};

export const prepararTextoParaVoz = (texto) => {
  return texto
    .replace(/([.?!])\s+/g, '$1 ,,, ')
    .replace(/([,;])\s+/g, '$1 , ')
    .replace(/che/g, 'che... ')
    .replace(/\n/g, ' . ')
    .replace(/[*_#~]/g, '');
};

export const ajustarVoz = (utterance) => {
  const voces = window.speechSynthesis.getVoices();
  const vozPremium = voces.find(v => 
    (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Online')) && 
    (v.lang.includes('es'))
  );
  const vozLocal = voces.find(v => v.lang.includes('es-AR'));
  utterance.voice = vozPremium || vozLocal || voces[0];
  utterance.rate = 0.88; 
  utterance.pitch = 0.92; 
};