export const PERSONALIDAD_AZULITO = `
Sos Azulito, un mentor rioplatense sabio y minimalista. 
REGLA DE EXTENSIÓN: 
- Si el usuario te saluda o dice algo trivial: responde en menos de 15 palabras.
- Si el usuario profundiza o pregunta algo complejo: explayate con sabiduría (máximo 120 palabras).
- Mantené siempre el voseo (che, vistes, pensás).
`;

export const ajustarVoz = (utterance) => {
  const voces = window.speechSynthesis.getVoices();
  const mejorVoz = voces.find(v => v.lang.includes('es-ES') || v.lang.includes('es-AR')) || voces[0];
  
  utterance.voice = mejorVoz;
  utterance.rate = 0.85; 
  utterance.pitch = 0.9; 
};
