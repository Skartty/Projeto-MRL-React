import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { projetoService } from "../services/projetoService";
import { normalizarProjetos } from "../utils/projetoMapper";
import "../styles/admin.css";

export default function Admin() {
  const [projetos, setProjetos] = useState([]);
  const [modalAberto, setModalAberto] = useState(false);
  const [projetoEditando, setProjetoEditando] = useState(null);

  useEffect(() => {
    projetoService.listar().then((dados) => {
      setProjetos(normalizarProjetos(dados));
    }).catch(() => {
      // se o backend ainda não estiver conectado, mantém lista vazia
    });
  }, []);

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
