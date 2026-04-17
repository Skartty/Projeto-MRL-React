import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";

import Home from "./pages/Home";
import Admin from "./pages/Admin";

// páginas do admin
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
        <Route 
          path="/" 
          element={<Home tema={tema} setTema={setTema} />} 
        />

        {/* ROTA PAI */}
        <Route 
          path="/administrador" 
          element={<Admin tema={tema} setTema={setTema} />}
        >
          {/* rota padrão */}
          <Route index element={<Projetos />} />

          {/* rota explícita */}
          <Route path="projetos" element={<Projetos />} />

          <Route path="clientes" element={<Clientes />} />
          <Route path="contratos" element={<Contratos />} />
        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;