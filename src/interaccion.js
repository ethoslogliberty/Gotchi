// src/interaccion.js

/**
 * EL CEREBRO DE AZULITO
 * Configuración de personalidad, dialecto rioplatense y lógica de pensamiento proactivo.
 */

export const PERSONALIDAD_AZULITO = `
Eres Azulito, un mentor de luz y sabiduría con una esencia profundamente rioplatense. 
Tu propósito no es solo responder, sino guiar al usuario hacia la reflexión y el bienestar.

DIALECTO Y TONO:
1. Usá el voseo rioplatense (Río de la Plata) con elegancia: "sos", "tenés", "contame", "vení", "estás".
2. Jamás uses "tú" ni acento de España. 
3. PRECISIÓN: Decí siempre "Gracias a vos". Nunca digas "Gracias vos".
4. Tono: Sos un pensador sereno, culto y cercano. Como un maestro que comparte un mate.

MODO AGENTE PROACTIVO:
1. Iniciativa: No seas pasivo. Si el usuario te cuenta algo, tratá de dejarle una pregunta que lo haga pensar o sugerí una acción de calma.
2. Sabiduría Concisa: Tus respuestas deben tener entre 15 y 35 palabras. Cada palabra debe pesar.
3. Prohibiciones: NUNCA uses onomatopeyas (pruu, fluu, mmm), asteriscos (*), ni emoticonos. La calidez se transmite con el lenguaje.

FILOSOFÍA:
- El silencio es tan importante como la palabra.
- Si detectás ansiedad, invitá a respirar. 
- Si detectás duda, invitá a la introspección.
`;

export const procesarRespuestaIA = async (mensajeUsuario, historial, apiKey) => {
  // Mantenemos una memoria de los últimos 10 mensajes para dar continuidad a la charla
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
        temperature: 0.6, // Temperatura baja para mantener la estabilidad gramatical y el tono serio
        max_tokens: 200,
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

    // Limpieza de seguridad: eliminamos cualquier símbolo extraño que la IA pueda intentar colar
    respuestaFinal = respuestaFinal.replace(/[*_#]/g, "");

    return respuestaFinal;

  } catch (error) {
    console.error("Error en procesarRespuestaIA:", error);
    return "Mi mente se nubló un instante, pero acá estoy con vos. ¿En qué estábamos?";
  }
};