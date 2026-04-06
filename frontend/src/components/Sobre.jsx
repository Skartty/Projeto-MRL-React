import "../styles/sobre.css";
import sobreImg from "../assets/Img_Sobre_Home.png";

import iconArquitetura from "../assets/Icon_Arquitetura_Branco.png";
import iconDev from "../assets/Icon_Desenvolvimento_Branco.png";
import iconDesign from "../assets/Icon_Design_Branco.png";

import iconArquiteturaPreto from "../assets/Icon_Arquitetura_Preto.png";
import iconDevPreto from "../assets/Icon_Desenvolvimento_Preto.png";
import iconDesignPreto from "../assets/Icon_Design_Preto.png";

function Sobre({ tema }) {
  return (
    <section id="sobre" className="sobre">
      <h2>
        SOBRE A <span>MRL</span>
      </h2>

      <div className="sobre-content">
        
        <div className="sobre-text coluna">
          <p>
            Na MRL Desenvolvimento de Software e Tecnologias, transformamos a
            complexidade técnica em vantagem competitiva para o seu negócio.
            Combinamos uma arquitetura de sistemas sólida com design intuitivo
            para entregar soluções que não apenas funcionam, mas escalam.
            Especialistas em desenvolvimento Web, Mobile e Microserviços/APIs,
            nosso compromisso é com a alta performance e a segurança dos dados.
            Na MRL, não entregamos apenas código; construímos a infraestrutura
            digital necessária para sustentar o crescimento acelerado da sua
            empresa com agilidade e eficiência.
          </p>
        </div>

        <div className="especializacao coluna">
          <h4>Nossa Especialização:</h4>

          <div className="especializacao-item">
            <span>ARQUITETURA</span>
            <img src={tema === "light" ? iconArquiteturaPreto : iconArquitetura} />            
          </div>

          <div className="especializacao-item">
            <span>DESENVOLVIMENTO</span>
            <img src={tema === "light" ? iconDevPreto : iconDev} />            
          </div>

          <div className="especializacao-item">
            <span>DESIGN</span>
            <img src={tema === "light" ? iconDesignPreto : iconDesign} />            
          </div>
        </div>

        <div className="sobre-img coluna">
          <img src={sobreImg} alt="sobre" />
        </div>

      </div>
    </section>
  );
}

export default Sobre;