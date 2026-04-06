import { useNavigate } from "react-router-dom";
import { useState } from "react";
import roboCadastro from "../assets/Robo_Cadastro.png";
import cadeadoFechado from "../assets/Cadeado_Fechado.png";
import cadeadoAberto from "../assets/Cadeado_Aberto.png";
import "../styles/authSection.css";

function AuthSection() {

  const navigate = useNavigate();
  const [modo, setModo] = useState("login");
  const [showSenha, setShowSenha] = useState(false);

  function formatCPF(value){
    value = value.replace(/\D/g,"")

    value = value.replace(/(\d{3})(\d)/,"$1.$2")
    value = value.replace(/(\d{3})(\d)/,"$1.$2")
    value = value.replace(/(\d{3})(\d{1,2})$/,"$1-$2")

    return value
  }

  function formatTelefone(value){
    value = value.replace(/\D/g,"")

    value = value.replace(/^(\d{2})(\d)/g,"($1) $2")
    value = value.replace(/(\d{5})(\d)/,"$1-$2")

    return value
  }

  return (
    <section id="auth" className="auth-container">

      <div className="auth-card">

        {modo === "login" && (
          <>
            <div className="auth-form">

              <h2>LOGIN</h2>

              <input type="email" placeholder="E-mail" />

              <div className="password-field">
                <input
                  type={showSenha ? "text" : "password"}
                  placeholder="Senha"
                />
                <img
                  src={showSenha ? cadeadoAberto : cadeadoFechado}
                  className="toggle-password"
                  onClick={() => setShowSenha(!showSenha)}
                />
              </div>

              {/* login simulado, sem backend, apenas para mostrar a navegação para o painel do administrador */}
              <button 
                className="auth-button"
                onClick={() => navigate("/administrador")}
              >
                Entrar
              </button>

              <p className="auth-switch">
                Não possui uma conta?
                <span onClick={() => setModo("cadastro")}>
                  Cadastre-se
                </span>
              </p>

            </div>

            <div className="auth-image">
              <img src={roboCadastro} alt="Robô login"/>
            </div>
          </>
        )}

        {modo === "cadastro" && (
          <>
            <div className="auth-image cadastro">
              <img src={roboCadastro} alt="Robô cadastro"/>
            </div>

            <div className="auth-form">

              <h2>CADASTRE-SE</h2>

              <input type="text" placeholder="Nome" />

              <input type="email" placeholder="E-mail" />

              <div className="input-row">
                <input
                  type="text"
                  placeholder="CPF/CNPJ"
                  onChange={(e)=>e.target.value=formatCPF(e.target.value)}
                  />

                  <input
                  type="text"
                  placeholder="Telefone"
                  onChange={(e)=>e.target.value=formatTelefone(e.target.value)}
                  />
              </div>

              <div className="form-row">
                <div className="password-field">
                  <input
                    type={showSenha ? "text" : "password"}
                    placeholder="Senha"
                  />
                  <img
                    src={showSenha ? cadeadoAberto : cadeadoFechado}
                    className="toggle-password"
                    onClick={() => setShowSenha(!showSenha)}
                  />
                </div>

                <div className="password-field">
                  <input
                    type={showSenha ? "text" : "password"}
                    placeholder="Confirme sua Senha"
                  />
                  <img
                    src={showSenha ? cadeadoAberto : cadeadoFechado}
                    className="toggle-password"
                    onClick={() => setShowSenha(!showSenha)}
                  />
                </div>

              </div>

              <button className="auth-button">
                Cadastrar
              </button>

              <p className="auth-switch">
                Já possui uma conta?
                <span onClick={() => setModo("login")}>
                  Fazer login
                </span>
              </p>

            </div>
          </>
        )}

      </div>

    </section>
  );
}

export default AuthSection;