import Coluna from "./Coluna";

export default function Kanban() {
  return (
    <div className="admin-kanban">
      <Coluna titulo="Planejamento" cor="#ff5100" />
      <Coluna titulo="Em Andamento" cor="#FFAE00" />
      <Coluna titulo="Finalizados" cor="#086000" />
      <Coluna titulo="Suspensos" cor="#600000" ultima />
    </div>
  );
}