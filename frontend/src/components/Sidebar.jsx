import { NavLink, useNavigate, useSearchParams } from "react-router-dom";
import { useState } from "react";
import { authService } from "../services/authService";
import ConfirmModal from "./ConfirmModal";
import { useToast } from "../hooks/useToast";

export default function Sidebar({ abrirNovoProjeto }) {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [searchParams] = useSearchParams();
  const [confirmarLogout, setConfirmarLogout] = useState(false);
  const usuario = authService.getUsuario();

  function confirmarSaida() {
    authService.logout();
    showToast("Você saiu da sua conta.", { type: "info" });
    navigate("/");
  }

  return (
    <div className="admin-sidebar">

      {/* PERFIL */}
      <div className="admin-perfil">
        <div className="admin-avatar"></div>
        <div>
          <h4 className="admin-nome">{usuario?.nome || "Usuário"}</h4>
          <span className="admin-cargo">{usuario?.cargo || "Cargo"}</span>
        </div>
      </div>

      {/* MENU */}
      <div className="admin-menu">

        <NavLink to="/administrador/projetos" className="admin-titulo">
          Gerenciador de Projetos
        </NavLink>

        <div className="admin-subitem destaque" onClick={abrirNovoProjeto}>
          <div className="admin-bola">+</div>
          <span>Novo Projeto</span>
        </div>

        <div className="admin-subitem" onClick={() => {
          const atual = searchParams.get("status");
          navigate(atual === "planejamento" ? "/administrador/projetos" : "/administrador/projetos?status=planejamento");
        }}>Planejamento</div>

        <div className="admin-subitem" onClick={() => {
          const atual = searchParams.get("status");
          navigate(atual === "andamento" ? "/administrador/projetos" : "/administrador/projetos?status=andamento");
        }}>Em Andamento</div>

        <div className="admin-subitem" onClick={() => {
          const atual = searchParams.get("status");
          navigate(atual === "finalizado" ? "/administrador/projetos" : "/administrador/projetos?status=finalizado");
        }}>Finalizados</div>

        <div className="admin-subitem" onClick={() => {
          const atual = searchParams.get("status");
          navigate(atual === "suspenso" ? "/administrador/projetos" : "/administrador/projetos?status=suspenso");
        }}>Suspensos</div>

        <NavLink to="/administrador/clientes" className="admin-titulo">
          Clientes
        </NavLink>
        <div className="admin-subitem" onClick={() => navigate("/administrador/clientes?status=Ativos")}>Ativos</div>
        <div className="admin-subitem" onClick={() => navigate("/administrador/clientes?status=Suspensos")}>Suspensos</div>

        <NavLink to="/administrador/contratos" className="admin-titulo">
          Contratos
        </NavLink>
        <div className="admin-subitem" onClick={() => navigate("/administrador/contratos?status=Ativos")}>Ativos</div>
        <div className="admin-subitem" onClick={() => navigate("/administrador/contratos?status=Finalizados")}>Finalizados</div>
        <div className="admin-subitem" onClick={() => navigate("/administrador/contratos?status=Suspensos")}>Suspensos</div>

      </div>

      {/* LOGOUT */}
      <div className="admin-logout" onClick={() => setConfirmarLogout(true)}>
        Sair
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
