import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "../services/authService";
import { useToast } from "../hooks/useToast";
import { blockInvalidNumericInput, maskCpfCnpj, maskPhone } from "../utils/masks";
import { isValidCpfCnpj, isValidEmail, isValidPhone, sanitizeText } from "../utils/validation";
import roboCadastro from "../assets/Home/Robo_Cadastro.png";
import cadeadoFechado from "../assets/Home/Cadeado_Fechado.png";
import cadeadoAberto from "../assets/Home/Cadeado_Aberto.png";
import "../styles/authSection.css";

const ERRO_TIMEOUT = 4500;

function getLoginMessage(error) {
  const message = error.response?.data?.erro || "";
  if (/usu[aá]rio.*n[aã]o encontrado/i.test(message)) return "Usuário não encontrado";
  if (/senha/i.test(message)) return "E-mail ou senha inválidos";
  if (/email|e-mail/i.test(message)) return "E-mail ou senha inválidos";
  return message || "Erro ao fazer login.";
}

function AuthSection() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [modo, setModo] = useState("login");
  const [showSenha, setShowSenha] = useState(false);
  const [erro, setErro] = useState("");
  const [camposInvalidos, setCamposInvalidos] = useState({});
  const [carregando, setCarregando] = useState(false);

  const [formLogin, setFormLogin] = useState({ email: "", senha: "" });
  const [formCadastro, setFormCadastro] = useState({
    nome: "",
    email: "",
    senha: "",
    confirmaSenha: "",
    cpfCnpj: "",
    telefone: "",
  });

  useEffect(() => {
    if (!erro) return undefined;
    const timer = window.setTimeout(() => {
      setErro("");
      setCamposInvalidos({});
    }, ERRO_TIMEOUT);
    return () => window.clearTimeout(timer);
  }, [erro]);

  function exibirErro(message, fields = {}) {
    setErro(message);
    setCamposInvalidos(fields);
    showToast(message, { type: "error" });
  }

  async function handleLogin(event) {
    event.preventDefault();
    setErro("");
    setCamposInvalidos({});

    const email = formLogin.email.trim().toLowerCase();
    const senha = formLogin.senha;

    if (!email || !senha) {
      exibirErro("Preencha todos os campos", { email: !email, senha: !senha });
      return;
    }

    if (!isValidEmail(email)) {
      exibirErro("Email inválido", { email: true });
      return;
    }

    setCarregando(true);
    try {
      const data = await authService.login(email, senha);
      showToast("Login realizado com sucesso.", { type: "success" });
      navigate(data.usuario.role === "admin" ? "/administrador" : "/catalogo");
    } catch (err) {
      const message = getLoginMessage(err);
      exibirErro(message, {
        email: /email|usu[aá]rio/i.test(message),
        senha: /senha/i.test(message),
      });
    } finally {
      setCarregando(false);
    }
  }

  async function handleCadastro(event) {
    event.preventDefault();
    setErro("");
    setCamposInvalidos({});

    const payload = {
      nome: sanitizeText(formCadastro.nome, 150),
      email: formCadastro.email.trim().toLowerCase(),
      senha: formCadastro.senha,
      cpfCnpj: formCadastro.cpfCnpj,
      telefone: formCadastro.telefone,
    };

    const invalidos = {
      nome: !payload.nome,
      email: !isValidEmail(payload.email),
      cpfCnpj: !isValidCpfCnpj(payload.cpfCnpj),
      telefone: !isValidPhone(payload.telefone),
      senha: !payload.senha || payload.senha.length < 6,
      confirmaSenha: payload.senha !== formCadastro.confirmaSenha,
    };

    if (Object.values(invalidos).some(Boolean)) {
      const message = !payload.nome || !payload.email || !payload.senha
        ? "Preencha todos os campos"
        : invalidos.confirmaSenha
          ? "As senhas não coincidem."
          : "Confira os dados informados.";
      exibirErro(message, invalidos);
      return;
    }

    setCarregando(true);
    try {
      await authService.cadastrar(payload);
      showToast("Cadastro realizado com sucesso.", { type: "success" });
      navigate("/catalogo");
    } catch (err) {
      exibirErro(err.response?.data?.erro || "Erro ao cadastrar.");
    } finally {
      setCarregando(false);
    }
  }

  return (
    <section id="auth" className="auth-container">
      <div className="auth-card">
        {modo === "login" && (
          <>
            <form className="auth-form" onSubmit={handleLogin} noValidate>
              <h2>LOGIN</h2>

              {erro && <p className="form-error-message">{erro}</p>}

              <input
                type="email"
                placeholder="E-mail"
                value={formLogin.email}
                className={camposInvalidos.email ? "field-error" : ""}
                onChange={(e) => setFormLogin({ ...formLogin, email: e.target.value })}
              />

              <div className="password-field">
                <input
                  type={showSenha ? "text" : "password"}
                  placeholder="Senha"
                  value={formLogin.senha}
                  className={camposInvalidos.senha ? "field-error" : ""}
                  onChange={(e) => setFormLogin({ ...formLogin, senha: e.target.value })}
                />
                <img
                  src={showSenha ? cadeadoAberto : cadeadoFechado}
                  className="toggle-password"
                  onClick={() => setShowSenha(!showSenha)}
                  alt={showSenha ? "Ocultar senha" : "Mostrar senha"}
                />
              </div>

              <button className="auth-button" type="submit" disabled={carregando}>
                {carregando ? "Entrando..." : "Entrar"}
              </button>

              <p className="auth-switch">
                Não possui uma conta?
                <span onClick={() => { setModo("cadastro"); setErro(""); setCamposInvalidos({}); }}>Cadastre-se</span>
              </p>
            </form>

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

            <form className="auth-form" onSubmit={handleCadastro} noValidate>
              <h2>CADASTRE-SE</h2>

              {erro && <p className="form-error-message">{erro}</p>}

              <input
                type="text"
                placeholder="Nome"
                value={formCadastro.nome}
                className={camposInvalidos.nome ? "field-error" : ""}
                onChange={(e) => setFormCadastro({ ...formCadastro, nome: e.target.value.replace(/[<>]/g, "").slice(0, 150) })}
              />

              <input
                type="email"
                placeholder="E-mail"
                value={formCadastro.email}
                className={camposInvalidos.email ? "field-error" : ""}
                onChange={(e) => setFormCadastro({ ...formCadastro, email: e.target.value })}
              />

              <div className="input-row">
                <input
                  type="text"
                  inputMode="numeric"
                  placeholder="CPF/CNPJ"
                  value={formCadastro.cpfCnpj}
                  className={camposInvalidos.cpfCnpj ? "field-error" : ""}
                  onKeyDown={blockInvalidNumericInput}
                  onPaste={(e) => e.preventDefault()}
                  onChange={(e) => setFormCadastro({ ...formCadastro, cpfCnpj: maskCpfCnpj(e.target.value) })}
                />
                <input
                  type="text"
                  inputMode="numeric"
                  placeholder="Telefone"
                  value={formCadastro.telefone}
                  className={camposInvalidos.telefone ? "field-error" : ""}
                  onKeyDown={blockInvalidNumericInput}
                  onPaste={(e) => e.preventDefault()}
                  onChange={(e) => setFormCadastro({ ...formCadastro, telefone: maskPhone(e.target.value) })}
                />
              </div>

              <div className="form-row">
                <div className="password-field">
                  <input
                    type={showSenha ? "text" : "password"}
                    placeholder="Senha"
                    value={formCadastro.senha}
                    className={camposInvalidos.senha ? "field-error" : ""}
                    onChange={(e) => setFormCadastro({ ...formCadastro, senha: e.target.value })}
                  />
                  <img
                    src={showSenha ? cadeadoAberto : cadeadoFechado}
                    className="toggle-password"
                    onClick={() => setShowSenha(!showSenha)}
                    alt={showSenha ? "Ocultar senha" : "Mostrar senha"}
                  />
                </div>

                <div className="password-field">
                  <input
                    type={showSenha ? "text" : "password"}
                    placeholder="Confirme sua Senha"
                    value={formCadastro.confirmaSenha}
                    className={camposInvalidos.confirmaSenha ? "field-error" : ""}
                    onChange={(e) => setFormCadastro({ ...formCadastro, confirmaSenha: e.target.value })}
                  />
                  <img
                    src={showSenha ? cadeadoAberto : cadeadoFechado}
                    className="toggle-password"
                    onClick={() => setShowSenha(!showSenha)}
                    alt={showSenha ? "Ocultar senha" : "Mostrar senha"}
                  />
                </div>
              </div>

              <button className="auth-button" type="submit" disabled={carregando}>
                {carregando ? "Cadastrando..." : "Cadastrar"}
              </button>

              <p className="auth-switch">
                Já possui uma conta?
                <span onClick={() => { setModo("login"); setErro(""); setCamposInvalidos({}); }}>Fazer login</span>
              </p>
            </form>
          </>
        )}
      </div>
    </section>
  );
}

export default AuthSection;
