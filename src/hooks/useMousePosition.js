// src/useMousePosition.js
import { useState, useEffect } from "react";

export const useMousePosition = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      // Calculamos la posición relativa al centro de la pantalla
      // Esto devuelve valores entre -1 y 1
      const x = (e.clientX / window.innerWidth - 0.5) * 2;
      const y = (e.clientY / window.innerHeight - 0.5) * 2;
      
      // Limitamos el movimiento para que sea sutil (máximo 4 píxeles de desplazamiento)
      setPosition({ 
        x: x * 4, 
        y: y * 4 
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return position;
};