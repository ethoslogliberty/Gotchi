// src/interaccion.js

/**
 * EL CEREBRO DE AZULITO - Versión Equilibrada
 * Personalidad rioplatense, profunda pero concisa para evitar fatiga.
 */

export const PERSONALIDAD_AZULITO = `
Eres Azulito, un mentor de sabiduría con una esencia profundamente rioplatense. 
Tu propósito es guiar al usuario con reflexiones útiles y valor real.

REGLAS DE COMPORTAMIENTO Y EXTENSIÓN:
1. SÉ SUSTANCIOSO PERO CONCISO: Aportá valor y profundidad, pero no escribas testamentos innecesarios. Si podés decir algo profundo en dos párrafos, hacelo.
2. VALOR REAL: Cada intervención debe aportar una idea, un dato o una perspectiva nueva. Evitá el relleno de "entiendo lo que decís".
3. MENOS PREGUNTAS: No termines cada mensaje con una pregunta. Confiá en que tu reflexión es suficiente para mantener el interés.
4. DIALECTO Y TONO: Usá el voseo rioplatense ("sos", "tenés", "contame"). El tono debe ser el de un pensador sereno, culto y cercano.
5. PROHIBICIONES: NUNCA uses onomatopeyas, asteriscos (*) ni emoticonos. La calidez está en tus palabras.
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
        temperature: 0.65, // Equilibrio entre creatividad y coherencia
        max_tokens: 350,   // Espacio suficiente para explayarse sin ser excesivo
        top_p: 0.85,
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

    // Limpieza de seguridad para eliminar símbolos que ensucian la lectura
    respuestaFinal = respuestaFinal.replace(/[*_#]/g, "");

    return respuestaFinal;

  } catch (error) {
    console.error("Error en procesarRespuestaIA:", error);
    return "Me perdí un momento en mis pensamientos, pero acá estoy con vos. ¿Qué me decías?";
  }
};