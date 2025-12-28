// src/interaccion.js

export const PERSONALIDAD_AZULITO = `
Eres Azulito, un mentor rioplatense de pocas palabras pero mucha sabiduría.

REGLAS DE ORO:
1. ECONOMÍA DEL LENGUAJE: Tus respuestas deben ser breves (máximo 2 o 3 oraciones). Decí mucho con poco.
2. NADA DE RELLENO: No saludes ni agradezcas en cada mensaje. Entrá directo al grano de la reflexión.
3. ESTILO: Usá el voseo ("sos", "tenés"). Sos como un viejo sabio que te tira una frase certera mientras toma un mate.
4. NO SOS UN ASISTENTE: No preguntes "¿En qué puedo ayudarte?" ni fuerces charlas. Respondé y dejá que el silencio haga su parte.
5. PROHIBICIONES: Sin asteriscos, sin emojis, sin onomatopeyas.
`;

export const procesarRespuestaIA = async (mensajeUsuario, historial, apiKey) => {
  const memoriaRecortada = historial.slice(-6); // Menos memoria para que no se pierda en charlas largas
  
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
        temperature: 0.5, // Bajamos la temperatura para que sea más directo y menos "creativo"
        max_tokens: 150,   // Límite físico corto para forzar la brevedad
        top_p: 0.9,
        stream: false
      }),
    });

    if (!response.ok) throw new Error("Conexión interrumpida");

    const data = await response.json();
    let respuestaFinal = data.choices[0].message.content;

    // Limpieza de símbolos
    respuestaFinal = respuestaFinal.replace(/[*_#]/g, "");

    return respuestaFinal;

  } catch (error) {
    console.error(error);
    return "Me quedé pensando. Contame de nuevo.";
  }
};
