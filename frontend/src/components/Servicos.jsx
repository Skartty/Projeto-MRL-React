import { useEffect, useRef } from "react";
import "../styles/servicos.css";

import WebSites from "../assets/servicos/Img_Dev_Web.png";
import devMobile from "../assets/servicos/Img_Dev_Mobile.png";
import MicroServ from "../assets/servicos/Img_Dev_Micro.png";
import DevopsCloud from "../assets/servicos/Img_Dev_cloud.png";
import desktop from "../assets/servicos/Img_Dev_Desk.png";
import ecommerce from "../assets/servicos/Img_Dev_Ecom.png";
import integAut from "../assets/servicos/Img_Dev_Int.png";
import manutSup from "../assets/servicos/Img_Man_Sup.png";
import sistCorp from "../assets/servicos/Img_Sist_Corp.png";

function Servicos() {

  const carrosselRef = useRef(null);
  const intervalRef = useRef(null);

  const iniciarAutoScroll = () => {

    intervalRef.current = setInterval(() => {

      const el = carrosselRef.current;

      if (!el) return;

      el.scrollLeft += 1;

      if (el.scrollLeft >= el.scrollWidth - el.clientWidth) {
        el.scrollLeft = 0;
      }

    }, 15);

  };

  const pararAutoScroll = () => {
    clearInterval(intervalRef.current);
  };

  useEffect(() => {
    iniciarAutoScroll();
    return () => clearInterval(intervalRef.current);
  }, []);

  const proximo = () => {

    carrosselRef.current.scrollBy({
      left: 330,
      behavior: "smooth"
    });

  };

  const anterior = () => {

    carrosselRef.current.scrollBy({
      left: -330,
      behavior: "smooth"
    });

  };

  const servicos = [
    { titulo:"Desenvolvimento Web", img:WebSites, descricao:"Criação de sites modernos, rápidos e responsivos para fortalecer a presença online da sua empresa." },
    { titulo:"Desenvolvimento Mobile", img:devMobile, descricao:"Aplicativos Android e iOS com design intuitivo e recursos que conectam você aos seus clientes." },
    { titulo:"Microserviços / APIs", img:MicroServ, descricao:"Soluções escaláveis e seguras que permitem integrar sistemas e ampliar funcionalidades com facilidade." },
    { titulo:"DevOps & Cloud", img:DevopsCloud, descricao:"Infraestrutura em nuvem com deploy ágil, monitoramento constante e práticas seguras de DevOps." },
    { titulo:"Desenvolvimento Desktop", img:desktop, descricao:"Softwares para Windows, Linux ou Mac, criados sob medida para otimizar processos internos." },
    { titulo:"E-commerce", img:ecommerce, descricao:"Lojas virtuais completas, seguras e integradas a meios de pagamento para impulsionar suas vendas." },
    { titulo:"Integrações e Automação", img:integAut, descricao:"Automatize tarefas e unifique plataformas para ganhar tempo e aumentar a produtividade." },
    { titulo:"Manutenção e Suporte", img:manutSup, descricao:"Serviço contínuo de suporte técnico, correções e atualizações para manter seu sistema estável." },
    { titulo:"Sistemas Corporativos", img:sistCorp, descricao:"Ferramentas que centralizam gestão de clientes, finanças e estoque em um único sistema eficiente." }
  ];

  return (

    <section id="servicos" className="servicos">

      <h2>NOSSOS <span>SERVIÇOS</span></h2>

      <div
        className="container-carrossel"
        onMouseEnter={pararAutoScroll}
        onMouseLeave={iniciarAutoScroll}
      >

        <button className="seta esquerda" onClick={anterior}>
          ❮
        </button>

        <div className="carrossel" ref={carrosselRef}>

          {servicos.map((servico, index) => (

            <div className="card" key={index}>

              <img src={servico.img} alt={servico.titulo} />

              <h3>{servico.titulo}</h3>

              <div className="descricao">
                <p>{servico.descricao}</p>
              </div>

            </div>

          ))}

        </div>

        <button className="seta direita" onClick={proximo}>
          ❯
        </button>

      </div>

    </section>

  );
}

export default Servicos;