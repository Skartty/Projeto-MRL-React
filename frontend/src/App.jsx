import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";

import Home from "./pages/Home";
import Admin from "./pages/Admin";
import Catalogo from "./pages/Catalogo";
import { RotaAdmin, RotaCliente } from "./components/RotaProtegida";

import Projetos from "./components/Projetos";
import Clientes from "./pages/Clientes";
import Contratos from "./pages/Contratos";

function App() {
  const [tema, setTema] = useState("dark");

  useEffect(() => {
    document.body.className = tema;
  }, [tema]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home tema={tema} setTema={setTema} />} />

        {/* ÁREA DO CLIENTE */}
        <Route
          path="/catalogo"
          element={
            <RotaCliente>
              <Catalogo />
            </RotaCliente>
          }
        />

        {/* ÁREA DO ADMINISTRADOR */}
        <Route
          path="/administrador"
          element={
            <RotaAdmin>
              <Admin tema={tema} setTema={setTema} />
            </RotaAdmin>
          }
        >
          <Route index element={<Projetos />} />
          <Route path="projetos" element={<Projetos />} />
          <Route path="clientes" element={<Clientes />} />
          <Route path="contratos" element={<Contratos />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;