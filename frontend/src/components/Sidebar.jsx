export default function Sidebar() {
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
        <h3 className="admin-titulo">Gerenciador de Projetos</h3>

        <div className="admin-subitem destaque">
            <div className="admin-bola">+</div>
            <span>Novo Projeto</span>
        </div>

        <div className="admin-subitem">Planejamento</div>
        <div className="admin-subitem">Em Andamento</div>
        <div className="admin-subitem">Finalizados</div>
        <div className="admin-subitem">Suspensos</div>

        {/* CLIENTES */}
        <h3 className="admin-titulo">Clientes</h3>
        <div className="admin-subitem">Ativos</div>
        <div className="admin-subitem">Suspensos</div>

        {/* CONTRATOS */}
        <h3 className="admin-titulo">Contratos</h3>
        <div className="admin-subitem">Ativos</div>
        <div className="admin-subitem">Suspensos</div>

      </div>
    </div>
  );
}