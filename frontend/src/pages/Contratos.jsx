import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import "../styles/contratos.css";

const contratosMock = [
  { id: 1, projeto: "Desenvolvimento de Web Site", cliente: "Isabella Braga", cpfCnpj: "123.456.789-00", status: "Ativos", andamento: 30, custo: 12000 },
  { id: 2, projeto: "Desenvolvimento de Web Site", cliente: "Isabella Braga", cpfCnpj: "987.654.321-00", status: "Ativos", andamento: 55, custo: 12000 },
  { id: 3, projeto: "Desenvolvimento de Web Site", cliente: "Isabella Braga", cpfCnpj: "111.222.333-44", status: "Suspensos", andamento: 10, custo: 12000 },
  { id: 4, projeto: "Desenvolvimento de Web Site", cliente: "Isabella Braga", cpfCnpj: "555.666.777-88", status: "Finalizados", andamento: 100, custo: 12000 },
];

const formatCurrency = (value) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);

const statusCor = { Ativos: "verde", Suspensos: "vermelho", Finalizados: "amarelo" };

export default function Contratos() {
  const [searchParams] = useSearchParams();
  const [contratos, setContratos] = useState(contratosMock);
  const [busca, setBusca] = useState("");
  const [filtroStatus, setFiltroStatus] = useState("Todos");
  const [mostrarFiltro, setMostrarFiltro] = useState(false);
  const [modalAberto, setModalAberto] = useState(false);
  const [contratoEditando, setContratoEditando] = useState(null);
  const [form, setForm] = useState({ cliente: "", cpfCnpj: "", status: "Ativo", custo: "" });
  const [confirmarExclusao, setConfirmarExclusao] = useState(null);

  useEffect(() => {
    const status = searchParams.get("status");
    setFiltroStatus(status || "Todos");
  }, [searchParams]);

  const contratosFiltrados = contratos.filter((c) => {
    const matchBusca =
      c.projeto.toLowerCase().includes(busca.toLowerCase()) ||
      c.cliente.toLowerCase().includes(busca.toLowerCase());
    const matchStatus = filtroStatus === "Todos" || c.status === filtroStatus;
    return matchBusca && matchStatus;
  });

  const statusMap = { Ativo: "Ativos", Suspenso: "Suspensos", Finalizado: "Finalizados" };
  const statusMapInverso = { Ativos: "Ativo", Suspensos: "Suspenso", Finalizados: "Finalizado" };

  const abrirModalNovo = () => {
    setContratoEditando(null);
    setForm({ cliente: "", cpfCnpj: "", status: "Ativo", custo: "" });
    setModalAberto(true);
  };

  const abrirModalEdicao = (contrato) => {
    setContratoEditando(contrato);
    setForm({
      cliente: contrato.cliente,
      cpfCnpj: contrato.cpfCnpj,
      status: statusMapInverso[contrato.status] || "Ativo",
      custo: String(contrato.custo),
    });
    setModalAberto(true);
  };

  const handleSalvar = () => {
    if (!form.cliente.trim()) return;

    if (contratoEditando) {
      setContratos(contratos.map((c) =>
        c.id === contratoEditando.id
          ? { ...c, cliente: form.cliente, cpfCnpj: form.cpfCnpj, status: statusMap[form.status] || "Ativos", custo: parseFloat(form.custo) || 0 }
          : c
      ));
    } else {
      setContratos([...contratos, {
        id: contratos.length + 1,
        projeto: "Novo Projeto",
        cliente: form.cliente,
        cpfCnpj: form.cpfCnpj,
        status: statusMap[form.status] || "Ativos",
        andamento: 0,
        custo: parseFloat(form.custo) || 0,
      }]);
    }

    setModalAberto(false);
    setContratoEditando(null);
  };

  const handleExcluir = (id) => {
    setContratos(contratos.filter((c) => c.id !== id));
    setConfirmarExclusao(null);
  };

  const handleFecharModal = (e) => {
    if (e.target.classList.contains("contratos-modal-overlay")) setModalAberto(false);
  };

  const handleFecharConfirmacao = (e) => {
    if (e.target.classList.contains("contratos-modal-overlay")) setConfirmarExclusao(null);
  };

  return (
    <div className="contratos-main">
      <h1 className="contratos-titulo">Contratos</h1>

      <div className="contratos-acoes">
        <input
          type="text"
          className="contratos-busca"
          placeholder="Buscar"
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
        />
        <div className="contratos-acoes-direita">
          <button className="contratos-btn-novo" onClick={abrirModalNovo}>
            Novo Contrato
          </button>
          <div className="contratos-filtro-wrapper">
            <button className="contratos-btn-filtro" onClick={() => setMostrarFiltro(!mostrarFiltro)} title="Filtrar">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
              </svg>
            </button>
            {mostrarFiltro && (
              <div className="contratos-filtro-dropdown">
                {["Todos", "Ativos", "Finalizados", "Suspensos"].map((op) => (
                  <button
                    key={op}
                    className={`contratos-filtro-op ${filtroStatus === op ? "ativo" : ""}`}
                    onClick={() => { setFiltroStatus(op); setMostrarFiltro(false); }}
                  >
                    {op}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="contratos-tabela-wrapper">
        <table className="contratos-tabela">
          <thead>
            <tr>
              <th>Projeto</th>
              <th>Cliente</th>
              <th>Andamento</th>
              <th>Custo</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {contratosFiltrados.length === 0 ? (
              <tr>
                <td colSpan={5} className="contratos-vazio">Nenhum contrato encontrado.</td>
              </tr>
            ) : (
              contratosFiltrados.map((contrato) => (
                <tr key={contrato.id} className="contratos-linha">
                  <td>
                    <div className="contratos-projeto-cell">
                      <span className={`contratos-indicador ${statusCor[contrato.status]}`} />
                      {contrato.projeto}
                    </div>
                  </td>
                  <td>{contrato.cliente}</td>
                  <td>
                    <div className="contratos-progresso-wrapper">
                      <div className="contratos-progresso-track">
                        <div className="contratos-progresso-fill" style={{ width: `${contrato.andamento}%` }} />
                      </div>
                    </div>
                  </td>
                  <td>{formatCurrency(contrato.custo)}</td>
                  <td>
                    <div className="contratos-acoes-linha">
                      {/* Editar */}
                      <button
                        className="contratos-btn-acao"
                        onClick={() => abrirModalEdicao(contrato)}
                        title="Editar"
                      >
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                        </svg>
                      </button>
                      {/* Excluir */}
                      <button
                        className="contratos-btn-acao excluir"
                        onClick={() => setConfirmarExclusao(contrato)}
                        title="Excluir"
                      >
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="3 6 5 6 21 6" />
                          <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                          <path d="M10 11v6M14 11v6" />
                          <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal criar/editar */}
      {modalAberto && (
        <div className="contratos-modal-overlay" onClick={handleFecharModal}>
          <div className="contratos-modal">
            <h2 className="contratos-modal-titulo">
              {contratoEditando ? "Editar Contrato" : "Cadastrar Contrato"}
            </h2>

            <div className="contratos-modal-campo">
              <label>Cliente</label>
              <input type="text" placeholder="Nome do cliente" value={form.cliente} onChange={(e) => setForm({ ...form, cliente: e.target.value })} />
            </div>
            <div className="contratos-modal-campo">
              <label>CPF/CNPJ</label>
              <input type="text" placeholder="000.000.000-00" value={form.cpfCnpj} onChange={(e) => setForm({ ...form, cpfCnpj: e.target.value })} />
            </div>
            <div className="contratos-modal-campo">
              <label>Status</label>
              <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                <option value="Ativo">Ativo</option>
                <option value="Finalizado">Finalizado</option>
                <option value="Suspenso">Suspenso</option>
              </select>
            </div>
            <div className="contratos-modal-campo">
              <label>Custo</label>
              <input type="text" placeholder="R$" value={form.custo} onChange={(e) => setForm({ ...form, custo: e.target.value })} />
            </div>

            <button className="contratos-modal-salvar" onClick={handleSalvar}>Salvar</button>
          </div>
        </div>
      )}

      {/* Modal confirmar exclusão */}
      {confirmarExclusao && (
        <div className="contratos-modal-overlay" onClick={handleFecharConfirmacao}>
          <div className="contratos-modal contratos-modal-confirmacao">
            <h2 className="contratos-modal-titulo">Excluir Contrato</h2>
            <p className="contratos-modal-texto">
              Tem certeza que deseja excluir o contrato de <strong>{confirmarExclusao.cliente}</strong>? Esta ação não pode ser desfeita.
            </p>
            <div className="contratos-modal-botoes">
              <button className="contratos-btn-cancelar" onClick={() => setConfirmarExclusao(null)}>Cancelar</button>
              <button className="contratos-btn-confirmar-exclusao" onClick={() => handleExcluir(confirmarExclusao.id)}>Excluir</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}