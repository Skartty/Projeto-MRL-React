import { useNavigate } from "react-router-dom";
import { useLayoutEffect, useState } from "react";
import { authService } from "../services/authService";
import Footer from "../components/Footer";
import ConfirmModal from "../components/ConfirmModal";
import { useToast } from "../hooks/useToast";
import "../styles/catalogo.css";

import DevMobile       from "../assets/User/Dev_Mobile.png";
import DevWebsites     from "../assets/User/Dev_Websites.png";
import DevMicro        from "../assets/User/Dev_Microservicos.png";
import DevDesktop      from "../assets/User/Dev_Desktop.png";
import DevEcommerce    from "../assets/User/Dev_Ecommerce.png";
import IntAutomacao    from "../assets/User/Int_Automacao.png";
import DevCloud        from "../assets/User/Dev_Cloud.png";
import SistCorp        from "../assets/User/Sist_Corporativos.png";
import ManSuporteImg   from "../assets/User/Man_Suporte.png";

const WA_LINK =
  "https://wa.me/5519997077633?text=Olá,%20vim%20pelo%20catálogo%20da%20MRL%20e%20gostaria%20de%20mais%20informações%20sobre%20os%20serviços.";

const CATEGORIAS = [
  "Criação de Novos Sistemas",
  "Integração e Automação",
  "Manutenção e Suporte",
];

const normalizarCategoria = (value) =>
  String(value ?? "").trim().toLocaleLowerCase("pt-BR");

const SERVICOS = [
  {
    titulo: "DESENVOLVIMENTO MOBILE",
    img: DevMobile,
    descricao:
      "Aplicativos Android e iOS com design intuitivo e recursos que conectam você aos seus clientes.",
    itens: ["Android & iOS", "Push", "Layout intuitivo", "APIs integradas"],
    categoria: "Criação de Novos Sistemas",
  },
  {
    titulo: "DESENVOLVIMENTO DE WEBSITES",
    img: DevWebsites,
    descricao:
      "Criação de sites modernos, rápidos e responsivos para fortalecer a presença online da sua empresa.",
    itens: ["Site responsivo", "SEO otimizado", "Design moderno", "Integração rápida"],
    categoria: "Criação de Novos Sistemas",
  },
  {
    titulo: "DESENVOLVIMENTO DE MICROSERVIÇOS/APIS",
    img: DevMicro,
    descricao:
      "Soluções escaláveis e seguras que permitem integrar sistemas e ampliar funcionalidades com facilidade.",
    itens: ["Alta performance", "APIs seguras", "Escalável", "Documentação clara"],
    categoria: "Integração e Automação",
  },
  {
    titulo: "DESENVOLVIMENTO DESKTOP",
    img: DevDesktop,
    descricao:
      "Softwares para Windows, Linux ou Mac, criados sob medida para otimizar processos internos.",
    itens: ["Multiplataforma", "Fácil instalação", "Uso offline", "Interface simples"],
    categoria: "Criação de Novos Sistemas",
  },
  {
    titulo: "DESENVOLVIMENTO DE E-COMMERCE",
    img: DevEcommerce,
    descricao:
      "Lojas virtuais completas, seguras e integradas a meios de pagamento para impulsionar suas vendas.",
    itens: ["Loja completa", "Pagamentos online", "Carrinho rápido", "Relatórios de vendas"],
    categoria: "Criação de Novos Sistemas",
  },
  {
    titulo: "INTEGRAÇÕES E AUTOMAÇÃO",
    img: IntAutomacao,
    descricao:
      "Automatize tarefas e unifique plataformas para ganhar tempo e aumentar a produtividade.",
    itens: ["Plataformas unidas", "Tarefas automáticas", "APIs externas", "Produtividade alta"],
    categoria: "Integração e Automação",
  },
  {
    titulo: "DEVOPS & CLOUD",
    img: DevCloud,
    descricao:
      "Infraestrutura em nuvem com deploy ágil, monitoramento constante e práticas seguras de DevOps.",
    itens: ["Deploy ágil", "Monitoramento contínuo", "Escalabilidade garantida", "Segurança reforçada"],
    categoria: "Manutenção e Suporte",
  },
  {
    titulo: "SISTEMAS CORPORATIVOS (ERP/CRM)",
    img: SistCorp,
    descricao:
      "Ferramentas que centralizam gestão de clientes, finanças e estoque em um único sistema eficiente.",
    itens: ["Gestão integrada", "Controle financeiro", "Organização de clientes", "Relatórios automáticos"],
    categoria: "Integração e Automação",
  },
  {
    titulo: "MANUTENÇÃO E SUPORTE",
    img: ManSuporteImg,
    descricao:
      "Serviço contínuo de suporte técnico, correções e atualizações para manter seu sistema estável.",
    itens: ["Atualizações constantes", "Correções de erros", "Backup periódico", "Atendimento rápido"],
    categoria: "Manutenção e Suporte",
  },
];

export default function Catalogo() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [confirmarLogout, setConfirmarLogout] = useState(false);
  const [categoriaSelecionada, setCategoriaSelecionada] = useState(null);
  const [busca, setBusca] = useState("");
  const usuario = authService.getUsuario();

  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  function confirmarSaida() {
    authService.logout();
    showToast("Você saiu da sua conta.", { type: "info" });
    navigate("/");
  }

  const servicosFiltrados = SERVICOS.filter((s) => {
    const matchCategoria =
      !categoriaSelecionada || normalizarCategoria(s.categoria) === normalizarCategoria(categoriaSelecionada);
    const matchBusca =
      !busca || s.titulo.toLocaleLowerCase("pt-BR").includes(busca.toLocaleLowerCase("pt-BR"));
    return matchCategoria && matchBusca;
  }).sort((a, b) => a.titulo.localeCompare(b.titulo, "pt-BR", { sensitivity: "base" }));

  return (
    <div className="cat-wrapper">

      {/* AVISO */}
      <div className="cat-aviso">
        🚧 Área do cliente em desenvolvimento — melhorias e novidades estão a caminho!
      </div>

      {/* HEADER */}
      <header className="cat-header">
        <div className="cat-header-esquerda">
          <div className="cat-avatar">
            {usuario?.nome?.charAt(0).toUpperCase() || "U"}
          </div>
        </div>

        <div className="cat-header-centro">
          <div className="cat-busca-wrapper">
            <input
              className="cat-busca"
              type="text"
              placeholder="Buscar Serviço"
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
            />
            {/* icone de busca foi removido para simplificar o design, mas pode ser adicionado futuramente se necessário */}
            {/* <span className="cat-busca-icone">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
              </svg>
            </span> */}
          </div>
        </div>

        <div className="cat-header-direita">
          <button
            className="cat-btn-logout"
            onClick={() => setConfirmarLogout(true)}
            title="Sair"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
          </button>
        </div>
      </header>

      {/* CATEGORIAS */}
      <nav className="cat-categorias">
        {CATEGORIAS.map((cat) => (
          <button
            key={cat}
            className={`cat-categoria-btn${categoriaSelecionada === cat ? " ativo" : ""}`}
            onClick={() =>
              setCategoriaSelecionada(categoriaSelecionada === cat ? null : cat)
            }
          >
            {cat}
          </button>
        ))}
      </nav>

      {/* GRID */}
      <main className="cat-grid-wrapper">
        <div className="cat-grid">
          {servicosFiltrados.map((s, i) => (
            <div key={i} className="cat-card">
              <div className="cat-card-img">
                <img src={s.img} alt={s.titulo} />
                <div className="cat-card-overlay">
                  <h3 className="cat-card-titulo">{s.titulo}</h3>
                </div>
              </div>

              <div className="cat-card-body">
                <p className="cat-card-desc">{s.descricao}</p>

                <ul className="cat-card-lista">
                  {s.itens.map((item, j) => (
                    <li key={j} className="cat-card-item">
                      <span className="cat-check">✓</span>
                      {item}
                    </li>
                  ))}
                </ul>

                <a
                  className="cat-btn-saiba"
                  href={WA_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  SAIBA MAIS
                </a>
              </div>
            </div>
          ))}
        </div>
      </main>

      <Footer />

      <ConfirmModal
        aberto={confirmarLogout}
        titulo="Sair da conta"
        mensagem="Tem certeza que deseja sair da sua conta?"
        textoCancelar="Cancelar"
        textoConfirmar="Sair"
        onCancelar={() => setConfirmarLogout(false)}
        onConfirmar={confirmarSaida}
      />
    </div>
  );
}
