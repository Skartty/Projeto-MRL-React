import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import "../styles/clientes.css";
import { clienteService } from "../services/clienteService";


const formatCurrency = (value) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);

const formatContratos = (n) => String(n).padStart(2, "0");

export default function Clientes() {
  const [searchParams] = useSearchParams();
  const [clientes, setClientes] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  const [busca, setBusca] = useState("");
  const [filtroStatus, setFiltroStatus] = useState("Todos");
  const [mostrarFiltro, setMostrarFiltro] = useState(false);
  const [modalAberto, setModalAberto] = useState(false);
  const [clienteEditando, setClienteEditando] = useState(null); // null = novo, objeto = editando
  const [form, setForm] = useState({ nome: "", cpfCnpj: "", status: "Ativo" });
  const [confirmarExclusao, setConfirmarExclusao] = useState(null);

  useEffect(() => {
    carregarClientes();
  }, []);

  async function carregarClientes() {
    try {
      setCarregando(true);
      const dados = await clienteService.listar();
      // normaliza o status vindo do banco para o padrão do frontend
      const normalizados = dados.map((c) => ({
        ...c,
        cpfCnpj: c.cpf_cnpj,
        status: c.status === "ativo" ? "Ativos" : "Suspensos",
      }));
      setClientes(normalizados);
    } catch {
      setErro("Erro ao carregar clientes.");
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    const status = searchParams.get("status");
    setFiltroStatus(status || "Todos");
  }, [searchParams]);

  const clientesFiltrados = clientes.filter((c) => {
    const matchBusca = c.nome.toLowerCase().includes(busca.toLowerCase());
    const matchStatus = filtroStatus === "Todos" || c.status === filtroStatus;
    return matchBusca && matchStatus;
  });

  const abrirModalNovo = () => {
    setClienteEditando(null);
    setForm({ nome: "", cpfCnpj: "", status: "Ativo" });
    setModalAberto(true);
  };

  const abrirModalEdicao = (cliente) => {
    setClienteEditando(cliente);
    setForm({
      nome: cliente.nome,
      cpfCnpj: cliente.cpfCnpj,
      status: cliente.status === "Ativos" ? "Ativo" : "Suspenso",
    });
    setModalAberto(true);
  };

  const handleSalvar = async () => {
    if (!form.nome.trim()) return;
    const statusConvertido = form.status === "Ativo" ? "ativo" : "suspenso";
    try {
      if (clienteEditando) {
        await clienteService.atualizar(clienteEditando.id, {
          nome: form.nome, cpfCnpj: form.cpfCnpj, status: statusConvertido,
        });
      } else {
        await clienteService.criar({
          nome: form.nome, cpfCnpj: form.cpfCnpj, status: statusConvertido,
        });
      }
      await carregarClientes();
      setModalAberto(false);
      setClienteEditando(null);
    } catch (err) {
      alert(err.response?.data?.erro || "Erro ao salvar cliente.");
    }
  };

  const handleExcluir = async (id) => {
    try {
      await clienteService.deletar(id);
      await carregarClientes();
      setConfirmarExclusao(null);
    } catch {
      alert("Erro ao excluir cliente.");
    }
  };

  const handleFecharModal = (e) => {
    if (e.target.classList.contains("clientes-modal-overlay")) {
      setModalAberto(false);
    }
  };

  const handleFecharConfirmacao = (e) => {
    if (e.target.classList.contains("clientes-modal-overlay")) {
      setConfirmarExclusao(null);
    }
  };

  return (
    <div className="clientes-main">
      <h1 className="clientes-titulo">Clientes</h1>

      <div className="clientes-acoes">
        <input
          type="text"
          className="clientes-busca"
          placeholder="Buscar"
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
        />
        <div className="clientes-acoes-direita">
          <button className="clientes-btn-novo" onClick={abrirModalNovo}>
            Novo Cliente
          </button>
          <div className="clientes-filtro-wrapper">
            <button className="clientes-btn-filtro" onClick={() => setMostrarFiltro(!mostrarFiltro)} title="Filtrar">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
              </svg>
            </button>
            {mostrarFiltro && (
              <div className="clientes-filtro-dropdown">
                {["Todos", "Ativos", "Suspensos"].map((op) => (
                  <button
                    key={op}
                    className={`clientes-filtro-op ${filtroStatus === op ? "ativo" : ""}`}
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

      {carregando && <p style={{ color: "#888", padding: "20px 0" }}>Carregando...</p>}
      {erro && <p style={{ color: "red", padding: "20px 0" }}>{erro}</p>}

      <div className="clientes-tabela-wrapper">
        <table className="clientes-tabela">
          <thead>
            <tr>
              <th>Cliente</th>
              <th>Status</th>
              <th>Custo</th>
              <th>Contratos Existentes</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {clientesFiltrados.length === 0 ? (
              <tr>
                <td colSpan={5} className="clientes-vazio">Nenhum cliente encontrado.</td>
              </tr>
            ) : (
              clientesFiltrados.map((cliente) => (
                <tr key={cliente.id} className="clientes-linha">
                  <td>
                    <div className="clientes-nome-cell">
                      <span className={`clientes-indicador ${cliente.status === "Ativos" ? "verde" : "vermelho"}`} />
                      {cliente.nome}
                    </div>
                  </td>
                  <td>{cliente.status}</td>
                  <td>{formatCurrency(cliente.custo)}</td>
                  <td>{formatContratos(cliente.contratos)}</td>
                  <td>
                    <div className="clientes-acoes-linha">
                      {/* Editar */}
                      <button
                        className="clientes-btn-acao"
                        onClick={() => abrirModalEdicao(cliente)}
                        title="Editar"
                      >
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                        </svg>
                      </button>
                      {/* Excluir */}
                      <button
                        className="clientes-btn-acao excluir"
                        onClick={() => setConfirmarExclusao(cliente)}
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
        <div className="clientes-modal-overlay" onClick={handleFecharModal}>
          <div className="clientes-modal">
            <h2 className="clientes-modal-titulo">
              {clienteEditando ? "Editar Cliente" : "Cadastrar Cliente"}
            </h2>

            <div className="clientes-modal-campo">
              <label>Cliente</label>
              <input
                type="text"
                placeholder="Nome do cliente"
                value={form.nome}
                onChange={(e) => setForm({ ...form, nome: e.target.value })}
              />
            </div>

            <div className="clientes-modal-campo">
              <label>CPF/CNPJ</label>
              <input
                type="text"
                placeholder="000.000.000-00"
                value={form.cpfCnpj}
                onChange={(e) => setForm({ ...form, cpfCnpj: e.target.value })}
              />
            </div>

            <div className="clientes-modal-campo">
              <label>Status</label>
              <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                <option value="Ativo">Ativo</option>
                <option value="Suspenso">Suspenso</option>
              </select>
            </div>

            <button className="clientes-modal-salvar" onClick={handleSalvar}>
              Salvar
            </button>
          </div>
        </div>
      )}

      {/* Modal confirmar exclusão */}
      {confirmarExclusao && (
        <div className="clientes-modal-overlay" onClick={handleFecharConfirmacao}>
          <div className="clientes-modal clientes-modal-confirmacao">
            <h2 className="clientes-modal-titulo">Excluir Cliente</h2>
            <p className="clientes-modal-texto">
              Tem certeza que deseja excluir <strong>{confirmarExclusao.nome}</strong>? Esta ação não pode ser desfeita.
            </p>
            <div className="clientes-modal-botoes">
              <button className="clientes-btn-cancelar" onClick={() => setConfirmarExclusao(null)}>
                Cancelar
              </button>
              <button className="clientes-btn-confirmar-exclusao" onClick={() => handleExcluir(confirmarExclusao.id)}>
                Excluir
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}