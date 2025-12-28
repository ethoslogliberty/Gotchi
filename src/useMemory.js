// src/useMemory.js
import { useState, useEffect } from 'react';

export const useMemory = () => {
  // Intentamos cargar el historial desde el almacenamiento del navegador
  const [historial, setHistorial] = useState(() => {
    const memoriaGuardada = localStorage.getItem('memoria_gotchi');
    return memoriaGuardada ? JSON.parse(memoriaGuardada) : [
      { 
        role: "system", 
        content: "Eres Azulito. Tienes memoria a largo plazo. Eres sabio, tierno y pausado. Si el usuario te dice su nombre o cosas sobre su vida, recuérdalas siempre. Responde con frases con sentido, profundas y dulces." 
      }
    ];
  });

  // Cada vez que el historial cambie, lo guardamos en LocalStorage
  useEffect(() => {
    localStorage.setItem('memoria_gotchi', JSON.stringify(historial));
  }, [historial]);

  // Función para borrar los recuerdos si quieres empezar de cero
  const borrarMemoria = () => {
    const base = [historial[0]]; // Mantiene solo el System Prompt
    setHistorial(base);
    localStorage.removeItem('memoria_gotchi');
  };

  return { historial, setHistorial, borrarMemoria };
};