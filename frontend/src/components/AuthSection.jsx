import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { authService } from "../services/authService";
import roboCadastro from "../assets/Robo_Cadastro.png";
import cadeadoFechado from "../assets/Cadeado_Fechado.png";
import cadeadoAberto from "../assets/Cadeado_Aberto.png";
import "../styles/authSection.css";

function AuthSection() {
  const navigate = useNavigate();
  const [modo, setModo] = useState("login");
  const [showSenha, setShowSenha] = useState(false);
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);

  const [formLogin, setFormLogin] = useState({ email: "", senha: "" });
  const [formCadastro, setFormCadastro] = useState({
    nome: "", email: "", senha: "", confirmaSenha: "", cpfCnpj: "", telefone: "",
  });

  function formatCPF(value) {
    value = value.replace(/\D/g, "");
    value = value.replace(/(\d{3})(\d)/, "$1.$2");
    value = value.replace(/(\d{3})(\d)/, "$1.$2");
    value = value.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
    return value;
  }

  function formatTelefone(value) {
    value = value.replace(/\D/g, "");
    value = value.replace(/^(\d{2})(\d)/g, "($1) $2");
    value = value.replace(/(\d{5})(\d)/, "$1-$2");
    return value;
  }

  async function handleLogin() {
    setErro("");
    setCarregando(true);
    try {
      const data = await authService.login(formLogin.email, formLogin.senha);
      if (data.usuario.role === "admin") {
        navigate("/administrador");
      } else {
        navigate("/catalogo");
      }
    } catch (err) {
      setErro(err.response?.data?.erro || "Erro ao fazer login.");
    } finally {
      setCarregando(false);
    }
  }

  async function handleCadastro() {
    setErro("");
    if (formCadastro.senha !== formCadastro.confirmaSenha) {
      setErro("As senhas não coincidem.");
      return;
    }
    setCarregando(true);
    try {
      await authService.cadastrar({
        nome: formCadastro.nome,
        email: formCadastro.email,
        senha: formCadastro.senha,
        cpfCnpj: formCadastro.cpfCnpj,
        telefone: formCadastro.telefone,
      });
      navigate("/catalogo");
    } catch (err) {
      setErro(err.response?.data?.erro || "Erro ao cadastrar.");
    } finally {
      setCarregando(false);
    }
  }

  return (
    <section id="auth" className="auth-container">
      <div className="auth-card">

        {modo === "login" && (
          <>
            <div className="auth-form">
              <h2>LOGIN</h2>

              {erro && <p style={{ color: "red", fontSize: "0.85rem" }}>{erro}</p>}

              <input
                type="email"
                placeholder="E-mail"
                value={formLogin.email}
                onChange={(e) => setFormLogin({ ...formLogin, email: e.target.value })}
              />

              <div className="password-field">
                <input
                  type={showSenha ? "text" : "password"}
                  placeholder="Senha"
                  value={formLogin.senha}
                  onChange={(e) => setFormLogin({ ...formLogin, senha: e.target.value })}
                  onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                />
                <img
                  src={showSenha ? cadeadoAberto : cadeadoFechado}
                  className="toggle-password"
                  onClick={() => setShowSenha(!showSenha)}
                />
              </div>

              <button className="auth-button" onClick={handleLogin} disabled={carregando}>
                {carregando ? "Entrando..." : "Entrar"}
              </button>

              <p className="auth-switch">
                Não possui uma conta?
                <span onClick={() => { setModo("cadastro"); setErro(""); }}>Cadastre-se</span>
              </p>
            </div>

            <div className="auth-image">
              <img src={roboCadastro} alt="Robô login" />
            </div>
          </>
        )}

        {modo === "cadastro" && (
          <>
            <div className="auth-image cadastro">
              <img src={roboCadastro} alt="Robô cadastro" />
            </div>

            <div className="auth-form">
              <h2>CADASTRE-SE</h2>

              {erro && <p style={{ color: "red", fontSize: "0.85rem" }}>{erro}</p>}

              <input
                type="text"
                placeholder="Nome"
                value={formCadastro.nome}
                onChange={(e) => setFormCadastro({ ...formCadastro, nome: e.target.value })}
              />

              <input
                type="email"
                placeholder="E-mail"
                value={formCadastro.email}
                onChange={(e) => setFormCadastro({ ...formCadastro, email: e.target.value })}
              />

              <div className="input-row">
                <input
                  type="text"
                  placeholder="CPF/CNPJ"
                  value={formCadastro.cpfCnpj}
                  onChange={(e) =>
                    setFormCadastro({ ...formCadastro, cpfCnpj: formatCPF(e.target.value) })
                  }
                />
                <input
                  type="text"
                  placeholder="Telefone"
                  value={formCadastro.telefone}
                  onChange={(e) =>
                    setFormCadastro({ ...formCadastro, telefone: formatTelefone(e.target.value) })
                  }
                />
              </div>

              <div className="form-row">
                <div className="password-field">
                  <input
                    type={showSenha ? "text" : "password"}
                    placeholder="Senha"
                    value={formCadastro.senha}
                    onChange={(e) => setFormCadastro({ ...formCadastro, senha: e.target.value })}
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
                    value={formCadastro.confirmaSenha}
                    onChange={(e) =>
                      setFormCadastro({ ...formCadastro, confirmaSenha: e.target.value })
                    }
                  />
                  <img
                    src={showSenha ? cadeadoAberto : cadeadoFechado}
                    className="toggle-password"
                    onClick={() => setShowSenha(!showSenha)}
                  />
                </div>
              </div>

              <button className="auth-button" onClick={handleCadastro} disabled={carregando}>
                {carregando ? "Cadastrando..." : "Cadastrar"}
              </button>

              <p className="auth-switch">
                Já possui uma conta?
                <span onClick={() => { setModo("login"); setErro(""); }}>Fazer login</span>
              </p>
            </div>
          </>
        )}
      </div>
    </section>
  );
}

export default AuthSection;