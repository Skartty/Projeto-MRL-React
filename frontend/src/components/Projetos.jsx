import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useOutletContext, useSearchParams } from "react-router-dom";
import IconUsuario from "../assets/Admin/Icon_Usuario.png";
import IconCalendario from "../assets/Admin/Icon_Calendario.png";
import IconTempo from "../assets/Admin/Icon_Tempo.png";
import "../styles/projetos.css";

// ─────────────────────────────────────────────────────────
// CONFIGURAÇÃO DAS COLUNAS
// ─────────────────────────────────────────────────────────
const COLUNAS = [
  { status: "planejamento", titulo: "Planejamento", cor: "#FF4900" },
  { status: "andamento",    titulo: "Em Andamento", cor: "#FFAE00" },
  { status: "finalizado",   titulo: "Finalizados",  cor: "#086000" },
  { status: "suspenso",     titulo: "Suspensos",    cor: "#600000" },
];

const STATUS_LABELS = {
  planejamento: "Planejamento",
  andamento:    "Em Andamento",
  finalizado:   "Finalizados",
  suspenso:     "Suspensos",
};

const FORM_VAZIO = {
  titulo: "",
  cliente: "",
  cpf: "",
  inicio: "",
  fim: "",
  valor: "",
  porcentagem: "",
  comentarios: "",
  status: "planejamento",
};

// ─────────────────────────────────────────────────────────
// CARD
// ─────────────────────────────────────────────────────────

function Card({ projeto, cor, abrirEdicao }) {
  return (
    <div className="proj-card">
      <div className="proj-card-header" style={{ background: cor }}>
        {projeto.titulo}
      </div>

      <div className="proj-card-body">
        <div className="proj-card-info">
          <img src={IconUsuario} alt="cliente" />
          <span>{projeto.cliente}</span>
        </div>
        <div className="proj-card-linha" />
        <div className="proj-card-info">
          <img src={IconCalendario} alt="início" />
          <span>{projeto.inicio}</span>
        </div>
        <div className="proj-card-linha" />
        <div className="proj-card-info">
          <img src={IconTempo} alt="fim" />
          <span>{projeto.fim}</span>
        </div>
      </div>

      <div
        className="proj-card-btn"
        style={{ background: cor }}
        onClick={() => abrirEdicao(projeto)}
        title="Editar projeto"
      >
        +
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// MODAL
// ─────────────────────────────────────────────────────────
function Modal({ fechar, projeto, setProjetos }) {
  const [form, setForm] = useState(projeto ?? FORM_VAZIO);
  const [confirmarExclusao, setConfirmarExclusao] = useState(false);

  const formatarData = (valor) => {
    valor = valor.replace(/\D/g, "");
    valor = valor.slice(0, 8);

    if (valor.length > 4) {
      return valor.replace(/(\d{2})(\d{2})(\d{0,4})/, "$1/$2/$3");
    } else if (valor.length > 2) {
      return valor.replace(/(\d{2})(\d{0,2})/, "$1/$2");
    }

    return valor;
  };

  useEffect(() => {
    setForm(projeto ?? FORM_VAZIO);
  }, [projeto]);

  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") fechar(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [fechar]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "inicio" || name === "fim") {
      setForm((prev) => ({
        ...prev,
        [name]: formatarData(value),
      }));
      return;
    }

    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const salvar = () => {
    if (!form.titulo.trim()) { alert("Informe o título do projeto."); return; }
    if (!form.cliente.trim()) { alert("Informe o nome do cliente."); return; }

    if (projeto) {
      setProjetos((prev) =>
        prev.map((p) => (p.id === projeto.id ? form : p))
      );
    } else {
      setProjetos((prev) => [...prev, { ...form, id: Date.now() }]);
    }

    fechar();
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) fechar();
  };

  return createPortal(
    <>
      {/* MODAL PRINCIPAL */}
      <div className="proj-overlay" onClick={handleOverlayClick}>
        <div className="proj-modal">

          <button className="proj-close" onClick={fechar} title="Fechar">✕</button>

          {/* TÍTULO */}
          <input
            className="proj-input-titulo"
            name="titulo"
            value={form.titulo}
            onChange={handleChange}
            placeholder="Título do projeto"
          />

          {/* STATUS */}
          <div className="proj-status">
            {Object.entries(STATUS_LABELS).map(([key, label]) => (
              <button
                key={key}
                className={`proj-status-btn ${key}${form.status === key ? " ativo" : ""}`}
                onClick={() => setForm((prev) => ({ ...prev, status: key }))}
              >
                {label}
              </button>
            ))}
          </div>

          <div className="proj-divider" />

          {/* FORMULÁRIO */}
          <div className="proj-form">

            <div className="proj-campo">
              <label>Cliente*</label>
              <input
                name="cliente"
                value={form.cliente}
                onChange={handleChange}
                placeholder="Nome do cliente"
              />
            </div>

            <div className="proj-campo">
              <label>CPF/CNPJ</label>
              <input
                name="cpf"
                value={form.cpf}
                onChange={handleChange}
                placeholder="000.000.000-00"
              />
            </div>

            <div className="proj-campo">
              <label>Data de Contratação</label>
              <input
                name="inicio"
                value={form.inicio}
                onChange={handleChange}
                placeholder="00/00/0000"
              />
            </div>

            <div className="proj-campo">
              <label>Previsão de Entrega</label>
              <input
                name="fim"
                value={form.fim}
                onChange={handleChange}
                placeholder="00/00/0000"
              />
            </div>

            <div className="proj-campo">
              <label>Valor</label>
              <input
                name="valor"
                value={form.valor}
                onChange={handleChange}
                placeholder="R$"
              />
            </div>

            <div className="proj-campo">
              <label>Progresso</label>
              <input
                name="porcentagem"
                value={form.porcentagem}
                onChange={handleChange}
                placeholder="Ex: 50%"
                list="proj-porcentagens"
              />
              <datalist id="proj-porcentagens">
                <option value="25%" />
                <option value="50%" />
                <option value="75%" />
                <option value="100%" />
              </datalist>
            </div>

            <div className="proj-campo full">
              <label>Descrição</label>
              <textarea
                name="comentarios"
                value={form.comentarios}
                onChange={handleChange}
              />
            </div>

          </div>

          {/* RODAPÉ */}
          <div className="proj-modal-footer">
            <button className="proj-salvar-btn" onClick={salvar}>
              Salvar
            </button>

            {projeto && (
              <button
                className="proj-excluir-btn"
                onClick={() => setConfirmarExclusao(true)}
                title="Excluir projeto"
              >
                🗑
              </button>
            )}
          </div>

        </div>
      </div>

      {/* MODAL DE CONFIRMAÇÃO */}
      {confirmarExclusao && (
        <div className="proj-overlay">
            <div className="proj-modal proj-modal-confirmacao">

            <p className="proj-modal-texto">
                Tem certeza que deseja excluir <strong>"{projeto.titulo}"</strong>?
            </p>

            <div className="proj-modal-botoes">
                <button
                className="proj-btn-cancelar"
                onClick={() => setConfirmarExclusao(false)}
                >
                Cancelar
                </button>

                <button
                className="proj-btn-confirmar-exclusao"
                onClick={() => {
                    setProjetos((prev) =>
                    prev.filter((p) => p.id !== projeto.id)
                    );
                    setConfirmarExclusao(false);
                    fechar();
                }}
                >
                Excluir
                </button>
            </div>

            </div>
        </div>
        )}
    </>,
    document.body
  );
}

// ─────────────────────────────────────────────────────────
// PROJETOS — componente principal da rota
// ─────────────────────────────────────────────────────────
export default function Projetos() {
  const { projetos, setProjetos, abrirEdicao, modalAberto, projetoEditando, fecharModal } =
    useOutletContext();

  const [searchParams] = useSearchParams();
  const statusFiltro = searchParams.get("status");

  return (
    <>
      <div className="proj-kanban">
        {COLUNAS.map((col, i) => {
          const cards = projetos.filter((p) => {
            if (statusFiltro) {
                return p.status === col.status && p.status === statusFiltro;
            }
            return p.status === col.status;
            });
          const isUltima = i === COLUNAS.length - 1;

          return (
            <div key={col.status} className={`proj-coluna${isUltima ? " ultima" : ""}`}>
              <div className="proj-coluna-header">{col.titulo}</div>

              <div className="proj-cards">
                {cards.map((projeto) => (
                  <Card
                    key={projeto.id}
                    projeto={projeto}
                    cor={col.cor}
                    abrirEdicao={abrirEdicao}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {modalAberto && (
        <Modal
          fechar={fecharModal}
          projeto={projetoEditando}
          setProjetos={setProjetos}
        />
      )}
    </>
  );
}