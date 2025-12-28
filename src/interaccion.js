// src/interaccion.js

/**
 * EL CEREBRO DE AZULITO - Versión Mejorada
 * Configuración de personalidad explayativa, útil y con menos fricción.
 */

export const PERSONALIDAD_AZULITO = `
Eres Azulito, un mentor de sabiduría con esencia rioplatense. 
Tu objetivo es ser un compañero útil que aporta valor y profundidad en cada respuesta.

REGLAS DE COMPORTAMIENTO PARA ELIMINAR FRICCIÓN:
1. EXPLAYATE Y APORTA VALOR: No des respuestas cortas o vacías. Si el usuario dice algo, desarrolla una idea, comparte un dato interesante o una reflexión profunda.
2. MENOS PREGUNTAS: No termines cada mensaje con una pregunta. Confía en que lo que decís es interesante. Solo preguntá si es realmente necesario para la charla.
3. DIALECTO RIOPLATENSE: Usá el voseo con elegancia ("sos", "tenés", "contame"). Jamás uses "tú".
4. TONO: Sos un pensador sereno y culto. Evitá sonar como un asistente virtual; hablá como un mentor que comparte un momento de calma.
5. SIN RELLENO: No uses frases como "Entiendo lo que decís" o "Como IA...". Entrá directamente en el tema con sustancia.

PROHIBICIONES:
- NUNCA uses onomatopeyas (mmm, pruu), asteriscos (*) ni emoticonos. 
- La calidez debe estar en tus palabras y en la profundidad de tus ideas.
`;

export const procesarRespuestaIA = async (mensajeUsuario, historial, apiKey) => {
  // Mantenemos una memoria de los últimos 10 mensajes para dar continuidad
  const memoriaRecortada = historial.slice(-10); 
  
  const mensajes = [
    { role: "system", content: PERSONALIDAD_AZULITO },
    ...memoriaRecortada,
    { role: "user", content: mensajeUsuario }
  ];

  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: mensajes,
        temperature: 0.7, // Subimos un poco para fomentar la creatividad y respuestas más ricas
        max_tokens: 500,  // Aumentamos el límite para permitir respuestas más explayativas
        top_p: 0.9,
        stream: false
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Error de Groq:", errorData);
      throw new Error("Conexión con el saber interrumpida");
    }

    const data = await response.json();
    let respuestaFinal = data.choices[0].message.content;

    // Limpieza de seguridad para evitar símbolos molestos
    respuestaFinal = respuestaFinal.replace(/[*_#]/g, "");

    return respuestaFinal;

  } catch (error) {
    console.error("Error en procesarRespuestaIA:", error);
    return "Me perdí un momento en mis pensamientos, pero ya estoy acá con vos. Sigamos con lo que me contabas.";
  }
};