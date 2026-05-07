import api from "./api";

export const clienteService = {
  async listar() {
    const { data } = await api.get("/clientes");
    return data;
  },

  async criar(cliente) {
    const { data } = await api.post("/clientes", cliente);
    return data;
  },

  async atualizar(id, cliente) {
    const { data } = await api.put(`/clientes/${id}`, cliente);
    return data;
  },

  async deletar(id) {
    await api.delete(`/clientes/${id}`);
  },
};