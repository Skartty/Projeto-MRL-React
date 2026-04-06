import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";

import Home from "./pages/Home";
import Admin from "./pages/Admin"; 

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

        <Route 
          path="/administrador" 
          element={<Admin tema={tema} setTema={setTema} />} 
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;