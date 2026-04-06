import "../styles/header.css";
import iconLight from "../assets/Icon_Modo_Claro.png";
import iconDark from "../assets/Icon_Modo_Escuro.png";

function Header({ tema, setTema }) {

  function toggleTema() {
    setTema(tema === "dark" ? "light" : "dark");
  }

  return (
    <header className="header">

      <img
        src={tema === "dark" ? iconLight : iconDark}
        className="theme-icon"
        onClick={toggleTema}
      />

      <nav>
        <a href="#sobre">Sobre</a>
        <a href="#servicos">Serviços</a>
        <a href="#auth">Cadastro</a>
        <a href="#avaliacoes">Avaliações</a>
        <a href="#contato">Contato</a>
      </nav>

      <a href="#auth">
        <button className="login-btn">Entrar</button>
      </a>

    </header>
  );
}

export default Header;