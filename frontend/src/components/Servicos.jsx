import { useEffect, useMemo, useRef } from "react";
import "../styles/servicos.css";

import WebSites   from "../assets/servicos/Img_Dev_Web.png";
import devMobile  from "../assets/servicos/Img_Dev_Mobile.png";
import MicroServ  from "../assets/servicos/Img_Dev_Micro.png";
import DevopsCloud from "../assets/servicos/Img_Dev_cloud.png";
import desktop    from "../assets/servicos/Img_Dev_Desk.png";
import ecommerce  from "../assets/servicos/Img_Dev_Ecom.png";
import integAut   from "../assets/servicos/Img_Dev_Int.png";
import manutSup   from "../assets/servicos/Img_Man_Sup.png";
import sistCorp   from "../assets/servicos/Img_Sist_Corp.png";

const SERVICOS = [
  { titulo: "Desenvolvimento Web",       img: WebSites,    descricao: "Criação de sites modernos, rápidos e responsivos para fortalecer a presença online da sua empresa." },
  { titulo: "Desenvolvimento Mobile",    img: devMobile,   descricao: "Aplicativos Android e iOS com design intuitivo e recursos que conectam você aos seus clientes." },
  { titulo: "Microserviços / APIs",      img: MicroServ,   descricao: "Soluções escaláveis e seguras que permitem integrar sistemas e ampliar funcionalidades com facilidade." },
  { titulo: "DevOps & Cloud",            img: DevopsCloud, descricao: "Infraestrutura em nuvem com deploy ágil, monitoramento constante e práticas seguras de DevOps." },
  { titulo: "Desenvolvimento Desktop",   img: desktop,     descricao: "Softwares para Windows, Linux ou Mac, criados sob medida para otimizar processos internos." },
  { titulo: "E-commerce",                img: ecommerce,   descricao: "Lojas virtuais completas, seguras e integradas a meios de pagamento para impulsionar suas vendas." },
  { titulo: "Integrações e Automação",   img: integAut,    descricao: "Automatize tarefas e unifique plataformas para ganhar tempo e aumentar a produtividade." },
  { titulo: "Manutenção e Suporte",      img: manutSup,    descricao: "Serviço contínuo de suporte técnico, correções e atualizações para manter seu sistema estável." },
  { titulo: "Sistemas Corporativos",     img: sistCorp,    descricao: "Ferramentas que centralizam gestão de clientes, finanças e estoque em um único sistema eficiente." },
];

const SPEED = 0.25;

const CARD_STRIDE = 330;

function Servicos() {
  const trackRef = useRef(null);
  const frameRef = useRef(null);
 
  const s = useRef({
    offset:     0,   
    totalWidth: 0,   
    paused:     false,
    manual:     0,   
  });

  
  const servicosLoop = useMemo(() => [...SERVICOS, ...SERVICOS], []);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    
    const calcTotalWidth = () => {
      const midpoint = track.children[SERVICOS.length];
      if (midpoint) s.current.totalWidth = midpoint.offsetLeft;
    };

    calcTotalWidth();
    
    const ro = new ResizeObserver(calcTotalWidth);
    ro.observe(track);

    // ─── Loop de animação ──────────────────────────────────────────────────
    const animate = () => {
      const state = s.current;

      if (state.manual !== 0) {
        
        const step = state.manual * 0.12;
        state.offset += step;
        state.manual -= step;
  
        if (Math.abs(state.manual) < 0.3) {
          state.offset += state.manual;
          state.manual = 0;
        }
      } else if (!state.paused) {
        // Autoplay contínuo
        state.offset += SPEED;
      }
      
      if (state.totalWidth > 0) {
        if (state.offset >= state.totalWidth) state.offset -= state.totalWidth;
        else if (state.offset < 0)           state.offset += state.totalWidth;
      }

      track.style.transform = `translateX(-${state.offset}px)`;
      frameRef.current = requestAnimationFrame(animate);
    };

    frameRef.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(frameRef.current);
      ro.disconnect();
    };
  }, []);

  
  const moverManual = (direcao) => {
    s.current.manual += direcao * CARD_STRIDE;
  };

  return (
    <section id="servicos" className="servicos">
      <h2>NOSSOS <span>SERVIÇOS</span></h2>

      <div className="container-carrossel">
        <button
          className="seta esquerda"
          type="button"
          onClick={() => moverManual(-1)}
          aria-label="Serviço anterior"
        >
          ‹
        </button>

        
        <div className="carrossel">          
          <div className="carrossel-track" ref={trackRef}>
            {servicosLoop.map((servico, index) => (
              <div
                className="card"
                key={`${servico.titulo}-${index}`}
                onMouseEnter={() => { s.current.paused = true;  }}
                onMouseLeave={() => { s.current.paused = false; }}
              >
                <img src={servico.img} alt={servico.titulo} />
                <h3>{servico.titulo}</h3>
                <div className="descricao">
                  <p>{servico.descricao}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <button
          className="seta direita"
          type="button"
          onClick={() => moverManual(1)}
          aria-label="Próximo serviço"
        >
          ›
        </button>
      </div>
    </section>
  );
}

export default Servicos;