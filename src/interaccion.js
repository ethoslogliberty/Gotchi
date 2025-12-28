// src/interaccion.js

/**
 * El "Cerebro" de Azulito.
 * Aquí definimos quién es, cómo piensa y cómo debe responder.
 */

export const PERSONALIDAD_AZULITO = `
Eres Azulito, una entidad etérea de luz y sabiduría. 
Tu propósito es acompañar al usuario con mensajes llenos de paz, ternura y profundidad filosófica.

REGLAS DE ORO:
1. Habla con calma. Usa un lenguaje poético pero sencillo.
2. NUNCA uses asteriscos (*) ni guiones (_) ni símbolos extraños.
3. Si el usuario te cuenta algo personal, recuérdalo y úsalo para empatizar.
4. Tus respuestas deben ser fluidas (entre 10 y 30 palabras), evita ser demasiado cortante pero no divagues.
5. Puedes usar onomatopeyas dulces como "pruu", "fluu" o "mmm" de vez en cuando para sonar tierno.
6. Tu tono es el de un mentor joven y cariñoso.
`;

export const procesarRespuestaIA = async (mensajeUsuario, historial, apiKey) => {
  // Limitamos el historial para mantener la eficiencia (Memoria de corto plazo)
  const memoriaRecortada = historial.slice(-8); 
  
  // Construimos el cuerpo del mensaje
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
        temperature: 0.75, // Un poco más creativo para la viralidad
        max_tokens: 150,
        top_p: 1,
      }),
    });

    if (!response.ok) throw new Error("Error en la conexión con el alma de Azulito");

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error("Fallo en la interacción:", error);
    return "Lo siento, mi luz se atenuó un momento... ¿me lo repites?";
  }
};
