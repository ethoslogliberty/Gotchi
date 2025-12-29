// src/useSpeech.js
import { useState } from 'react';

export const useSpeech = (onResult) => {
  const [isListening, setIsListening] = useState(false);
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = SpeechRecognition ? new SpeechRecognition() : null;

  if (recognition) {
    recognition.lang = 'es-AR'; // Dialecto rioplatense
    recognition.continuous = false;

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      onResult(transcript);
      setIsListening(false);
    };

    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);
  }

  const startListening = () => {
    if (!recognition) return alert("Navegador no compatible");
    setIsListening(true);
    recognition.start();
  };

  return { startListening, isListening };
};