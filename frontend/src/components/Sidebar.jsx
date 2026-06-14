import { NavLink, useNavigate, useSearchParams } from "react-router-dom";
import { useState } from "react";
import { authService } from "../services/authService";
import ConfirmModal from "./ConfirmModal";
import { useToast } from "../hooks/useToast";
import iconAdmin from "../assets/Admin/Icon_Admin.png";
import iconLight from "../assets/Admin/Icon_Modo_Claro.png";
import iconDark from "../assets/Admin/Icon_Modo_Escuro.png";

export default function Sidebar({ abrirNovoProjeto, tema, setTema }) {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [searchParams] = useSearchParams();
  const [confirmarLogout, setConfirmarLogout] = useState(false);
  const [menuAberto, setMenuAberto] = useState(false);
  const usuario = authService.getUsuario();

  function confirmarSaida() {
    authService.logout();
    showToast("Você saiu da sua conta.", { type: "info" });
    navigate("/");
  }

  function toggleTema() {
    setTema(tema === "dark" ? "light" : "dark");
  }

  function fecharMenuMobile() {
    setMenuAberto(false);
  }

  function navegarProjetosPorStatus(status) {
    const atual = searchParams.get("status");
    navigate(atual === status ? "/administrador/projetos" : `/administrador/projetos?status=${status}`);
    fecharMenuMobile();
  }

  return (
    <div className={`admin-sidebar${menuAberto ? " aberto" : ""}`}>

      <button
        className="admin-mobile-toggle"
        type="button"
        onClick={() => setMenuAberto((aberto) => !aberto)}
        aria-label={menuAberto ? "Fechar menu administrativo" : "Abrir menu administrativo"}
        aria-expanded={menuAberto}
      >
        <span />
        <span />
        <span />
      </button>

      {/* PERFIL */}
      <div className="admin-perfil">
        <div className="admin-avatar">
          <img src={iconAdmin} alt="Administrador" />
        </div>
        <div>
          <h4 className="admin-nome">{usuario?.nome || "Usuário"}</h4>
          <span className="admin-cargo">{usuario?.cargo || "Cargo"}</span>
        </div>
      </div>

      {/* MENU */}
      <div className="admin-menu">

        <NavLink to="/administrador/projetos" className="admin-titulo" onClick={fecharMenuMobile}>
          Gerenciador de Projetos
        </NavLink>

        <div className="admin-subitem destaque" onClick={() => { abrirNovoProjeto(); fecharMenuMobile(); }}>
          <div className="admin-bola">+</div>
          <span>Novo Projeto</span>
        </div>

        <div className="admin-subitem" onClick={() => navegarProjetosPorStatus("planejamento")}>Planejamento</div>
        <div className="admin-subitem" onClick={() => navegarProjetosPorStatus("andamento")}>Em Andamento</div>
        <div className="admin-subitem" onClick={() => navegarProjetosPorStatus("finalizado")}>Finalizados</div>
        <div className="admin-subitem" onClick={() => navegarProjetosPorStatus("suspenso")}>Suspensos</div>

        <NavLink to="/administrador/clientes" className="admin-titulo" onClick={fecharMenuMobile}>
          Clientes
        </NavLink>
        <div className="admin-subitem" onClick={() => { navigate("/administrador/clientes?status=Ativos"); fecharMenuMobile(); }}>Ativos</div>
        <div className="admin-subitem" onClick={() => { navigate("/administrador/clientes?status=Suspensos"); fecharMenuMobile(); }}>Suspensos</div>

        <NavLink to="/administrador/contratos" className="admin-titulo" onClick={fecharMenuMobile}>
          Contratos
        </NavLink>
        <div className="admin-subitem" onClick={() => { navigate("/administrador/contratos?status=Ativos"); fecharMenuMobile(); }}>Ativos</div>
        <div className="admin-subitem" onClick={() => { navigate("/administrador/contratos?status=Finalizados"); fecharMenuMobile(); }}>Finalizados</div>
        <div className="admin-subitem" onClick={() => { navigate("/administrador/contratos?status=Suspensos"); fecharMenuMobile(); }}>Suspensos</div>

      </div>

      <div className="admin-sidebar-footer">
        <button
          className="admin-theme-toggle"
          type="button"
          onClick={toggleTema}
          aria-label={tema === "dark" ? "Ativar modo claro" : "Ativar modo escuro"}
          title={tema === "dark" ? "Modo claro" : "Modo escuro"}
        >
          <img src={tema === "dark" ? iconLight : iconDark} alt="" aria-hidden="true" />
        </button>

        {/* LOGOUT */}
        <div className="admin-logout" onClick={() => setConfirmarLogout(true)}>
          Sair
        </div>
      </div>

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
