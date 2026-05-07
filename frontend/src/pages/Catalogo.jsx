import { useNavigate } from "react-router-dom";
import { authService } from "../services/authService";
import Footer from "../components/Footer";
import "../styles/catalogo.css";

import WebSites from "../assets/servicos/Img_Dev_Web.png";
import devMobile from "../assets/servicos/Img_Dev_Mobile.png";
import MicroServ from "../assets/servicos/Img_Dev_Micro.png";
import DevopsCloud from "../assets/servicos/Img_Dev_cloud.png";
import desktop from "../assets/servicos/Img_Dev_Desk.png";
import ecommerce from "../assets/servicos/Img_Dev_Ecom.png";
import integAut from "../assets/servicos/Img_Dev_Int.png";
import manutSup from "../assets/servicos/Img_Man_Sup.png";
import sistCorp from "../assets/servicos/Img_Sist_Corp.png";
import logoMRL from "../assets/Logo_MRL.png";

const WA_LINK =
  "https://wa.me/5519997077633?text=Olá,%20vim%20pelo%20catálogo%20da%20MRL%20e%20gostaria%20de%20mais%20informações%20sobre%20os%20serviços.";

const CATEGORIAS = [
  "Criação de Novos Sistemas",
  "Integração e Automação",
  "Manutenção e Suporte",
];

const SERVICOS = [
  {
    titulo: "DESENVOLVIMENTO MOBILE",
    img: devMobile,
    descricao:
      "Aplicativos Android e iOS com design intuitivo e recursos que conectam você aos seus clientes.",
    itens: ["Android & iOS", "Push", "Layout intuitivo", "APIs integradas"],
  },
  {
    titulo: "DESENVOLVIMENTO DE WEBSITES",
    img: WebSites,
    descricao:
      "Criação de sites modernos, rápidos e responsivos para fortalecer a presença online da sua empresa.",
    itens: ["Site responsivo", "SEO otimizado", "Design moderno", "Integração rápida"],
  },
  {
    titulo: "DESENVOLVIMENTO DE MICROSERVIÇOS/APIS",
    img: MicroServ,
    descricao:
      "Soluções escaláveis e seguras que permitem integrar sistemas e ampliar funcionalidades com facilidade.",
    itens: ["Alta performance", "APIs seguras", "Escalável", "Documentação clara"],
  },
  {
    titulo: "DESENVOLVIMENTO DESKTOP",
    img: desktop,
    descricao:
      "Softwares para Windows, Linux ou Mac, criados sob medida para otimizar processos internos.",
    itens: ["Multiplataforma", "Fácil instalação", "Uso offline", "Interface simples"],
  },
  {
    titulo: "DESENVOLVIMENTO DE E-COMMERCE",
    img: ecommerce,
    descricao:
      "Lojas virtuais completas, seguras e integradas a meios de pagamento para impulsionar suas vendas.",
    itens: ["Loja completa", "Pagamentos online", "Carrinho rápido", "Relatórios de vendas"],
  },
  {
    titulo: "INTEGRAÇÕES E AUTOMAÇÃO",
    img: integAut,
    descricao:
      "Automatize tarefas e unifique plataformas para ganhar tempo e aumentar a produtividade.",
    itens: ["Plataformas unidas", "Tarefas automáticas", "APIs externas", "Produtividade alta"],
  },
  {
    titulo: "DEVOPS & CLOUD",
    img: DevopsCloud,
    descricao:
      "Infraestrutura em nuvem com deploy ágil, monitoramento constante e práticas seguras de DevOps.",
    itens: ["Deploy ágil", "Monitoramento contínuo", "Escalabilidade garantida", "Segurança reforçada"],
  },
  {
    titulo: "SISTEMAS CORPORATIVOS (ERP/CRM)",
    img: sistCorp,
    descricao:
      "Ferramentas que centralizam gestão de clientes, finanças e estoque em um único sistema eficiente.",
    itens: ["Gestão integrada", "Controle financeiro", "Organização de clientes", "Relatórios automáticos"],
  },
  {
    titulo: "MANUTENÇÃO E SUPORTE",
    img: manutSup,
    descricao:
      "Serviço contínuo de suporte técnico, correções e atualizações para manter seu sistema estável.",
    itens: ["Atualizações constantes", "Correções de erros", "Backup periódico", "Atendimento rápido"],
  },
];

export default function Catalogo() {
  const navigate = useNavigate();
  const usuario = authService.getUsuario();

  function handleLogout() {
    authService.logout();
    navigate("/");
  }

  return (
    <div className="cat-wrapper">
      {/* AVISO */}
      <div className="cat-aviso">
        🚧 Área do cliente em desenvolvimento — melhorias e novidades estão a caminho!
      </div>

      {/* HEADER */}
      <header className="cat-header">
        <div className="cat-header-esquerda">
          <img src={logoMRL} alt="MRL" className="cat-logo" />
        </div>

        <div className="cat-header-centro">
          <input
            className="cat-busca"
            type="text"
            placeholder="Buscar Serviço"
            readOnly
          />
        </div>

        <div className="cat-header-direita">
          <span className="cat-usuario-nome">
            {usuario?.nome?.split(" ")[0]}
          </span>

          <button className="cat-btn-logout" onClick={handleLogout} title="Sair">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
          </button>
        </div>
      </header>

      {/* CATEGORIAS */}
      <div className="cat-categorias">
        {CATEGORIAS.map((cat) => (
          <button key={cat} className="cat-categoria-btn">
            {cat}
          </button>
        ))}
      </div>

      {/* GRID */}
      <main className="cat-grid-wrapper">
        <div className="cat-grid">
          {SERVICOS.map((s, i) => (
            <div key={i} className="cat-card">
              <div className="cat-card-img">
                <img src={s.img} alt={s.titulo} />
                <div className="cat-card-img-overlay">
                  <h3>{s.titulo}</h3>
                </div>
              </div>

              <div className="cat-card-body">
                <p className="cat-card-desc">{s.descricao}</p>

                <ul className="cat-card-lista">
                  {s.itens.map((item, j) => (
                    <li key={j}>
                      <span className="cat-check">✓</span>
                      {item}
                    </li>
                  ))}
                </ul>

                {/* BOTÃO CORRIGIDO */}
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
    </div>
  );
}