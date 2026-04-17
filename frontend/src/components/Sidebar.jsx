import { NavLink, useNavigate, useSearchParams } from "react-router-dom";

export default function Sidebar({ abrirNovoProjeto }) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  return (
    <div className="admin-sidebar">

      {/* PERFIL */}
      <div className="admin-perfil">
        <div className="admin-avatar"></div>
        <div>
          <h4 className="admin-nome">Nome Usuário</h4>
          <span className="admin-cargo">Cargo</span>
        </div>
      </div>

      {/* MENU */}
      <div className="admin-menu">

        {/* GERENCIADOR */}
        <NavLink to="/administrador/projetos" className="admin-titulo">
          Gerenciador de Projetos
        </NavLink>
        <div className="admin-subitem destaque" onClick={abrirNovoProjeto}>
          <div className="admin-bola">+</div>
          <span>Novo Projeto</span>
        </div>


        <div
          className="admin-subitem"
          onClick={() => {
            const atual = searchParams.get("status");
            navigate(
              atual === "planejamento"
                ? "/administrador/projetos"
                : "/administrador/projetos?status=planejamento"
            );
          }}
        >
          Planejamento
        </div>

        <div
          className="admin-subitem"
          onClick={() => {
            const atual = searchParams.get("status");
            navigate(
              atual === "andamento"
                ? "/administrador/projetos"
                : "/administrador/projetos?status=andamento"
            );
          }}
        >
          Em Andamento
        </div>

        <div
          className="admin-subitem"
          onClick={() => {
            const atual = searchParams.get("status");
            navigate(
              atual === "finalizado"
                ? "/administrador/projetos"
                : "/administrador/projetos?status=finalizado"
            );
          }}
        >
          Finalizados
        </div>

        <div
          className="admin-subitem"
          onClick={() => {
            const atual = searchParams.get("status");
            navigate(
              atual === "suspenso"
                ? "/administrador/projetos"
                : "/administrador/projetos?status=suspenso"
            );
          }}
        >
          Suspensos
        </div>

        {/* CLIENTES */}
        <NavLink to="/administrador/clientes" className="admin-titulo">
          Clientes
        </NavLink>

        {/* ↓ Apenas esses dois mudam ↓ */}
        <div
          className="admin-subitem"
          onClick={() => navigate("/administrador/clientes?status=Ativos")}
        >
          Ativos
        </div>
        <div
          className="admin-subitem"
          onClick={() => navigate("/administrador/clientes?status=Suspensos")}
        >
          Suspensos
        </div>

        {/* CONTRATOS */}
        <NavLink to="/administrador/contratos" className="admin-titulo">
          Contratos
        </NavLink>

        <div
          className="admin-subitem"
          onClick={() => navigate("/administrador/contratos?status=Ativos")}
        >
          Ativos
        </div>
        <div
          className="admin-subitem"
          onClick={() => navigate("/administrador/contratos?status=Finalizados")}
        >
          Finalizados
        </div>
        <div
          className="admin-subitem"
          onClick={() => navigate("/administrador/contratos?status=Suspensos")}
        >
          Suspensos
        </div>

      </div>
    </div>
  );
}