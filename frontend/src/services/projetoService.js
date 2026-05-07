import api from "./api";

export const projetoService = {
  async listar() {
    const { data } = await api.get("/projetos");
    return data;
  },

  async criar(projeto) {
    const { data } = await api.post("/projetos", projeto);
    return data;
  },

  async atualizar(id, projeto) {
    const { data } = await api.put(`/projetos/${id}`, projeto);
    return data;
  },

  async deletar(id) {
    await api.delete(`/projetos/${id}`);
  },
};
