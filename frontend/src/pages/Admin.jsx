import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import "../styles/admin.css";

export default function Admin() {
  const [projetos, setProjetos] = useState([
    {
      id: 1,
      titulo: "Desenvolvimento Web",
      cliente: "Isabella Braga",
      cpf: "",
      inicio: "03/03/2026",
      fim: "03/06/2026",
      valor: "R$ 12.000,00",
      porcentagem: "50%",
      comentarios: "",
      status: "planejamento",
    },
    {
      id: 2,
      titulo: "Sistema ERP",
      cliente: "João Silva",
      cpf: "",
      inicio: "01/02/2026",
      fim: "01/05/2026",
      valor: "",
      porcentagem: "",
      comentarios: "",
      status: "andamento",
    },
    {
      id: 3,
      titulo: "App Mobile",
      cliente: "Maria Souza",
      cpf: "",
      inicio: "10/01/2026",
      fim: "10/04/2026",
      valor: "",
      porcentagem: "",
      comentarios: "",
      status: "finalizado",
    },
    {
      id: 4,
      titulo: "App Mobile",
      cliente: "Maria Souza",
      cpf: "",
      inicio: "10/01/2026",
      fim: "10/04/2026",
      valor: "",
      porcentagem: "",
      comentarios: "",
      status: "suspenso",
    },
  ]);

  const [modalAberto, setModalAberto] = useState(false);
  const [projetoEditando, setProjetoEditando] = useState(null);

  const abrirNovoProjeto = () => {
    setProjetoEditando(null);
    setModalAberto(true);
  };

  const abrirEdicao = (projeto) => {
    setProjetoEditando(projeto);
    setModalAberto(true);
  };

  const fecharModal = () => {
    setModalAberto(false);
    setProjetoEditando(null);
  };

  return (
    <div className="admin">
      <Sidebar abrirNovoProjeto={abrirNovoProjeto} />

      <div style={{ flex: 1 }}>
        <Outlet
          context={{
            projetos,
            setProjetos,
            abrirEdicao,
            modalAberto,
            projetoEditando,
            fecharModal,
          }}
        />
      </div>
    </div>
  );
}