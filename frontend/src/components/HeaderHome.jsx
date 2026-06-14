import { useState } from "react";
import "../styles/header.css";
import iconLight from "../assets/Home/Icon_Modo_Claro.png";
import iconDark from "../assets/Home/Icon_Modo_Escuro.png";

function Header({ tema, setTema }) {
  const [menuAberto, setMenuAberto] = useState(false);

  function toggleTema() {
    setTema(tema === "dark" ? "light" : "dark");
  }

  function fecharMenu() {
    setMenuAberto(false);
  }

  return (
    <header className="header">

      <img
        src={tema === "dark" ? iconLight : iconDark}
        className="theme-icon"
        onClick={toggleTema}
        alt=""
        aria-hidden="true"
      />

      <button
        className={`header-menu-toggle${menuAberto ? " ativo" : ""}`}
        type="button"
        onClick={() => setMenuAberto((aberto) => !aberto)}
        aria-label={menuAberto ? "Fechar menu" : "Abrir menu"}
        aria-expanded={menuAberto}
      >
        <span />
        <span />
        <span />
      </button>

      <nav className={menuAberto ? "aberto" : ""}>
        <a href="#sobre" onClick={fecharMenu}>Sobre</a>
        <a href="#servicos" onClick={fecharMenu}>Serviços</a>
        <a href="#auth" onClick={fecharMenu}>Cadastro</a>
        <a href="#avaliacoes" onClick={fecharMenu}>Avaliações</a>
        <a href="#contato" onClick={fecharMenu}>Contato</a>
      </nav>

      <a href="#auth" className="header-login-link" onClick={fecharMenu}>
        <button className="login-btn">Entrar</button>
      </a>

    </header>
  );
}

export default Header;
