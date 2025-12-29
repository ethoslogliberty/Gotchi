// src/interaccion.js
export const PERSONALIDAD_AZULITO = `
Sos Azulito, un mentor rioplatense sabio y minimalista. 
REGLA DE EXTENSIÓN: 
- Si el usuario te saluda o dice algo trivial: responde en menos de 15 palabras.
- Si el usuario profundiza o pregunta algo complejo: explayate con sabiduría (máximo 120 palabras).

`;

export const ajustarVoz = (utterance) => {
  const voces = window.speechSynthesis.getVoices();
  // Buscamos una voz en español que suene bien
  const mejorVoz = voces.find(v => v.lang.includes('es-ES') || v.lang.includes('es-AR')) || voces[0];
  
  utterance.voice = mejorVoz;
  utterance.rate = 0.85; // Un poco más lento para dar calma
  utterance.pitch = 0.9; // Un tono más grave y serio
};