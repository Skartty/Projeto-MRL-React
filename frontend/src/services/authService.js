import api from "./api";

export const authService = {
  async login(email, senha) {
    const { data } = await api.post("/auth/login", { email, senha });
    localStorage.setItem("token", data.token);
    localStorage.setItem("usuario", JSON.stringify(data.usuario));
    return data;
  },

  async cadastrar(dados) {
    const { data } = await api.post("/auth/cadastrar", dados);
    localStorage.setItem("token", data.token);
    localStorage.setItem("usuario", JSON.stringify(data.usuario));
    return data;
  },

  logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");
  },

  getUsuario() {
    const u = localStorage.getItem("usuario");
    return u ? JSON.parse(u) : null;
  },

  isLogado() {
    return !!localStorage.getItem("token");
  },

  isAdmin() {
    const usuario = this.getUsuario();
    return usuario?.role === "admin";
  },
};