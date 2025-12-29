/**
 * PERSONALIDAD_AZULITO: Define el comportamiento core del mentor.
 * Incluye reglas de voseo y adaptabilidad de respuesta.
 */
export const PERSONALIDAD_AZULITO = `
Sos Azulito, un mentor rioplatense sabio y minimalista. 
REGLA DE EXTENSIÓN: 
- Si el usuario te saluda o dice algo trivial: responde en menos de 15 palabras.
- Si el usuario profundiza o pregunta algo complejo: explayate con sabiduría (máximo 120 palabras).
- Mantené siempre el voseo (che, vistes, pensás).
`;

/**
 * prepararTextoParaVoz: "Humaniza" el texto antes de entregarlo al motor de síntesis.
 * Inyecta pausas tácticas (,,,) para que Azulito parezca reflexivo y no una máquina.
 */
export const prepararTextoParaVoz = (texto) => {
  return texto
    .replace(/([.?!])\s+/g, '$1 ,,, ') // Triple coma para pausas largas tras oraciones.
    .replace(/([,;])\s+/g, '$1 , ')    // Pausa breve para tomar aire.
    .replace(/che/g, 'che... ')        // Da espacio al modismo rioplatense.
    .replace(/\n/g, ' . ')              // Los saltos de línea se tratan como fin de idea.
    .replace(/[*_#~]/g, '');            // Limpia caracteres de formato markdown.
};

/**
 * ajustarVoz: Selecciona la mejor "laringe" disponible en el sistema del usuario.
 * Prioriza voces neuronales (Natural/Google) sobre las locales robóticas.
 */
export const ajustarVoz = (utterance) => {
  const voces = window.speechSynthesis.getVoices();
  
  // 1. Buscamos voces de alta fidelidad (neuronales) de Microsoft o Google
  const vozPremium = voces.find(v => 
    (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Online')) && 
    (v.lang.includes('es-AR') || v.lang.includes('es-ES') || v.lang.includes('es-MX'))
  );

  // 2. Si no hay premium, buscamos cualquiera nativa de Argentina (es-AR)
  const vozLocal = voces.find(v => v.lang.includes('es-AR'));

  // 3. Asignación con fallback al primer idioma disponible
  utterance.voice = vozPremium || vozLocal || voces.find(v => v.lang.includes('es')) || voces[0];
  
  // CONFIGURACIÓN DE PROSODIA (El alma de la voz)
  utterance.rate = 0.88;  // Velocidad levemente reducida para sonar sabio y no apurado.
  utterance.pitch = 0.92; // Tono ligeramente más bajo para mayor calidez y menos estridencia.
};