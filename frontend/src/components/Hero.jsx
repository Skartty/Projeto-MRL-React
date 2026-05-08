import "../styles/hero.css";
import banner from "../assets/Home/Fundo_Robo_Home.png";

function Hero() {
  return (
    <section
      className="hero"
      style={{ backgroundImage: `url(${banner})` }}
    >
      <div className="overlay">
        <h1>SOLUÇÕES DE SOFTWARE INOVADORAS</h1>

        <p>
          Criamos softwares de ponta que impulsionam negócios a crescer,
          otimizar e inovar. De aplicações personalizadas a sistemas
          integrados, nossa tecnologia transforma ideias em poderosas
          soluções digitais.
        </p>

        <a href="#auth">
        <button className="hero-btn">Cadastre-se →</button>
        </a>

      </div>
    </section>
  );
}

export default Hero;
