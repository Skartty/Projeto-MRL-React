import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import "../styles/contratos.css";
import { contratoService } from "../services/contratoService";

const formatCurrency = (value) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);

const statusCor = { Ativos: "amarelo", Suspensos: "vermelho", Finalizados: "verde" };

export default function Contratos() {
  const [searchParams] = useSearchParams();
  const [contratos, setContratos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [busca, setBusca] = useState("");
  const [filtroStatus, setFiltroStatus] = useState("Todos");
  const [mostrarFiltro, setMostrarFiltro] = useState(false);

  useEffect(() => {
    carregarContratos();
  }, []);

  async function carregarContratos() {
    try {
      setCarregando(true);
      const dados = await contratoService.listar();
      const normalizados = dados.map((c) => ({
        ...c,
        projeto: c.projeto_titulo || "Sem projeto",
        cliente: c.cliente_nome,
        cpfCnpj: c.cliente_cpf_cnpj,
        status: c.status === "ativo" ? "Ativos" : c.status === "finalizado" ? "Finalizados" : "Suspensos",
      }));
      setContratos(normalizados);
    } catch {
      console.error("Erro ao carregar contratos.");
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    const status = searchParams.get("status");
    setFiltroStatus(status || "Todos");
  }, [searchParams]);

  const contratosFiltrados = contratos.filter((c) => {
    const termo = busca.toLowerCase();
    const matchBusca =
      c.projeto.toLowerCase().includes(termo) ||
      c.cliente.toLowerCase().includes(termo);
    const matchStatus = filtroStatus === "Todos" || c.status === filtroStatus;
    return matchBusca && matchStatus;
  });

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
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {carregando ? (
              <tr>
                <td colSpan={5} className="contratos-vazio">Carregando...</td>
              </tr>
            ) : contratosFiltrados.length === 0 ? (
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
                  <td>{contrato.status}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
