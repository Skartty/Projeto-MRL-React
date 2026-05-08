import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useOutletContext, useSearchParams } from "react-router-dom";
import IconUsuario from "../assets/Admin/Icon_Usuario.png";
import IconCalendario from "../assets/Admin/Icon_Calendario.png";
import IconTempo from "../assets/Admin/Icon_Tempo.png";
import "../styles/projetos.css";
import { projetoService } from "../services/projetoService";
import { clienteService } from "../services/clienteService";
import { normalizarProjetos, parseMoedaBR } from "../utils/projetoMapper";
import { useToast } from "../hooks/useToast";
import { blockInvalidNumericInput, maskCurrency, maskDate, maskPercent } from "../utils/masks";
import { isSafeText, isValidDateBR, sanitizeText } from "../utils/validation";

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
  const { showToast } = useToast();
  const [form, setForm] = useState(projeto ?? FORM_VAZIO);
  const [clientes, setClientes] = useState([]);
  const [carregandoClientes, setCarregandoClientes] = useState(true);
  const [camposInvalidos, setCamposInvalidos] = useState({});
  const [confirmarExclusao, setConfirmarExclusao] = useState(false);

  useEffect(() => {
    let ativo = true;

    clienteService.listar()
      .then((dados) => {
        if (ativo) setClientes(dados);
      })
      .catch(() => {
        if (ativo) setClientes([]);
      })
      .finally(() => {
        if (ativo) setCarregandoClientes(false);
      });

    return () => { ativo = false; };
  }, []);

  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") fechar(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [fechar]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "inicio" || name === "fim") {
      setForm((prev) => ({ ...prev, [name]: maskDate(value) }));
      return;
    }

    if (name === "valor") {
      setForm((prev) => ({ ...prev, valor: maskCurrency(value) }));
      return;
    }

    if (name === "porcentagem") {
      setForm((prev) => ({ ...prev, porcentagem: maskPercent(value) }));
      return;
    }

    if (name === "titulo") {
      setForm((prev) => ({ ...prev, titulo: value.replace(/[<>]/g, "").slice(0, 200) }));
      return;
    }

    if (name === "comentarios") {
      setForm((prev) => ({ ...prev, comentarios: String(value ?? "").replace(/[<>]/g, "").slice(0, 1000) }));
      return;
    }

    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleClienteChange = (e) => {
    const clienteId = Number(e.target.value);
    const cliente = clientes.find((item) => item.id === clienteId);

    setForm((prev) => ({
      ...prev,
      clienteId: cliente?.id || "",
      cliente: cliente?.nome || "",
      cpf: cliente?.cpf_cnpj || "",
    }));
  };

  const salvar = async () => {
    const titulo = sanitizeText(form.titulo, 200);
    const invalidos = {
      titulo: !isSafeText(titulo, { maxLength: 200 }),
      clienteId: !form.clienteId,
      inicio: Boolean(form.inicio) && !isValidDateBR(form.inicio),
      fim: Boolean(form.fim) && !isValidDateBR(form.fim),
      porcentagem: Number(form.porcentagem || 0) < 0 || Number(form.porcentagem || 0) > 100,
    };

    setCamposInvalidos(invalidos);

    if (!clientes.length) {
      showToast("Cadastre um cliente antes de criar projetos.", { type: "warning" });
      return;
    }

    if (Object.values(invalidos).some(Boolean)) {
      showToast("Confira os dados do projeto antes de salvar.", { type: "warning" });
      return;
    }

    const payload = {
      titulo,
      clienteId: Number(form.clienteId),
      status: form.status,
      dataContratacao: form.inicio,
      previsaoEntrega: form.fim,
      valor: parseMoedaBR(form.valor),
      progresso: parseInt(String(form.porcentagem).replace("%", "")) || 0,
      descricao: form.comentarios,
    };

    try {
      if (projeto) {
        await projetoService.atualizar(projeto.id, payload);
        showToast("Projeto atualizado com sucesso.", { type: "success" });
      } else {
        await projetoService.criar(payload);
        showToast("Projeto criado com sucesso.", { type: "success" });
      }
      // Recarrega a lista
      const dados = await projetoService.listar();
      setProjetos(normalizarProjetos(dados));
      fechar();
    } catch (err) {
      showToast(err.response?.data?.erro || "Erro ao salvar projeto.", { type: "error" });
    }
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
            className={`proj-input-titulo ${camposInvalidos.titulo ? "field-error" : ""}`}
            name="titulo"
            value={form.titulo}
            onChange={handleChange}
            placeholder="Título do projeto"
            maxLength={200}
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
              <select
                name="clienteId"
                value={form.clienteId || ""}
                onChange={handleClienteChange}
                className={camposInvalidos.clienteId ? "field-error" : ""}
                disabled={carregandoClientes || clientes.length === 0}
              >
                <option value="">
                  {carregandoClientes
                    ? "Carregando clientes..."
                    : clientes.length === 0
                      ? "Nenhum cliente cadastrado"
                      : "Selecione um cliente"}
                </option>
                {clientes.map((cliente) => (
                  <option key={cliente.id} value={cliente.id}>
                    {cliente.nome}
                  </option>
                ))}
              </select>
            </div>

            <div className="proj-campo">
              <label>CPF/CNPJ</label>
              <input
                name="cpf"
                value={form.cpf}
                placeholder="000.000.000-00"
                readOnly
              />
            </div>

            <div className="proj-campo">
              <label>Data de Contratação</label>
              <input
                name="inicio"
                inputMode="numeric"
                value={form.inicio}
                onChange={handleChange}
                onKeyDown={blockInvalidNumericInput}
                onPaste={(e) => e.preventDefault()}
                className={camposInvalidos.inicio ? "field-error" : ""}
                placeholder="00/00/0000"
              />
            </div>

            <div className="proj-campo">
              <label>Previsão de Entrega</label>
              <input
                name="fim"
                inputMode="numeric"
                value={form.fim}
                onChange={handleChange}
                onKeyDown={blockInvalidNumericInput}
                onPaste={(e) => e.preventDefault()}
                className={camposInvalidos.fim ? "field-error" : ""}
                placeholder="00/00/0000"
              />
            </div>

            <div className="proj-campo">
              <label>Valor</label>
              <input
                name="valor"
                inputMode="numeric"
                value={form.valor}
                onChange={handleChange}
                onKeyDown={blockInvalidNumericInput}
                onPaste={(e) => e.preventDefault()}
                placeholder="R$"
              />
            </div>

            <div className="proj-campo">
              <label>Progresso</label>
              <input
                name="porcentagem"
                inputMode="numeric"
                value={form.porcentagem}
                onChange={handleChange}
                onKeyDown={blockInvalidNumericInput}
                onPaste={(e) => e.preventDefault()}
                className={camposInvalidos.porcentagem ? "field-error" : ""}
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
                maxLength={1000}
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
                onClick={async () => {
                    try {
                      await projetoService.deletar(projeto.id);
                      const dados = await projetoService.listar();
                      setProjetos(normalizarProjetos(dados));
                      setConfirmarExclusao(false);
                      fechar();
                      showToast("Projeto excluído com sucesso.", { type: "success" });
                    } catch (err) {
                      showToast(err.response?.data?.erro || "Erro ao excluir projeto.", { type: "error" });
                    }
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
          key={projetoEditando?.id || "novo"}
          fechar={fecharModal}
          projeto={projetoEditando}
          setProjetos={setProjetos}
        />
      )}
    </>
  );
}
