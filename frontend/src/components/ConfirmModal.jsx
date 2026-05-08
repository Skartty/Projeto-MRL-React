import { useEffect } from "react";
import { createPortal } from "react-dom";
import "../styles/feedback.css";

export default function ConfirmModal({
  aberto,
  titulo = "Confirmar ação",
  mensagem,
  textoCancelar = "Cancelar",
  textoConfirmar = "Confirmar",
  tipo = "danger",
  onCancelar,
  onConfirmar,
}) {
  useEffect(() => {
    if (!aberto) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") onCancelar?.();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [aberto, onCancelar]);

  if (!aberto) return null;

  const handleOverlayClick = (event) => {
    if (event.target === event.currentTarget) onCancelar?.();
  };

  return createPortal(
    <div className="confirm-overlay" onMouseDown={handleOverlayClick}>
      <section className="confirm-modal" role="dialog" aria-modal="true" aria-labelledby="confirm-title">
        <h2 id="confirm-title">{titulo}</h2>
        <p>{mensagem}</p>
        <div className="confirm-actions">
          <button type="button" className="confirm-btn confirm-cancel" onClick={onCancelar}>
            {textoCancelar}
          </button>
          <button type="button" className={`confirm-btn confirm-${tipo}`} onClick={onConfirmar}>
            {textoConfirmar}
          </button>
        </div>
      </section>
    </div>,
    document.body
  );
}
