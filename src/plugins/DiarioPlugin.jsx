// src/plugins/DiarioPlugin.jsx
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

      <div className={`plugin-panel ${isOpen ? 'open' : 'closed'}`}>
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
      </div>
    </div>
  );
};