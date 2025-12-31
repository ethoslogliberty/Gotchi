// src/plugins/DiarioPlugin.jsx
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

export const DiarioPlugin = ({ historial }) => {
  const [isOpen, setIsOpen] = useState(false);

  // Filtramos solo los mensajes del usuario para la bitácora
  const misNotas = historial.filter(m => m.role === "user");

  return (
    <div className="plugin-container">
      {/* Botón Flotante */}
      <button 
        className="plugin-trigger"
        onClick={() => setIsOpen(!isOpen)}
        title="Ver mi bitácora"
      >
        {isOpen ? "✕" : "📔"}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, x: -50, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -50, scale: 0.9 }}
            className="plugin-panel"
          >
            <div className="plugin-header">
              <h4>Tu Bitácora</h4>
              <span>{misNotas.length} notas</span>
            </div>
            
            <div className="plugin-content">
              {misNotas.length > 0 ? (
                misNotas.map((nota, i) => (
                  <div key={i} className="plugin-card">
                    <p>{nota.content}</p>
                  </div>
                ))
              ) : (
                <p className="plugin-empty">Azulito aún no tiene notas tuyas...</p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};