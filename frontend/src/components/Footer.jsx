import "../styles/footer.css";

import logoGit from "../assets/Logo_Git.png";
import logoInsta from "../assets/Logo_Insta.png";
import logoLinkedin from "../assets/Logo_Linkedin.png";
import logoMRL from "../assets/Logo_MRL.png";

function Footer() {
  return (
    <footer id="contato" className="footer">

      <div className="footer-content">

        <div className="footer-left">

          <h3 className="footer-title">Empresa</h3>

          <p className="footer-text">
            MRL Desenvolvimento de Software e Tecnologias Ltda
          </p>

          <p className="footer-text">
            CNPJ 50.163.155/0001-17
          </p>

          <h3 className="footer-title contato">Fale Conosco</h3>

          <a 
            className="footer-text-contato"
            href="mailto:MIRAELRIBEIRODEV@GMAIL.COM"
          >
            MIRAELRIBEIRODEV@GMAIL.COM
          </a>

          <a
            className="footer-text-contato"
            href="https://wa.me/5519997077633?text=Olá,%20vim%20pelo%20site%20da%20MRL%20e%20gostaria%20de%20mais%20informações%20sobre%20os%20serviços."
            target="_blank"
            rel="noopener noreferrer"
          >
            WhatsApp: 19 99707-7633
          </a>

        </div>


        <div className="footer-right">

          <h3 className="footer-title">Redes sociais</h3>

          <a href="https://github.com/MiraelRibeiro" className="social-link">
            <img src={logoGit} alt="GitHub"/>
            GitHub
          </a>

          <a href="https://www.instagram.com/mrltech.br/" className="social-link">
            <img src={logoInsta} alt="Instagram"/>
            Instagram
          </a>

          <a href="https://www.linkedin.com/in/mirael-ribeiro-dev/" className="social-link">
            <img src={logoLinkedin} alt="LinkedIn"/>
            Linkedin
          </a>

        </div>

      </div>


      <div className="footer-bottom">

        <img src={logoMRL} className="footer-logo" alt="MRL"/>

        <p className="copyright">
          © 2026 MRL Desenvolvimento de Software e Tecnologias Ltda
        </p>

      </div>

    </footer>
  );
}

export default Footer;