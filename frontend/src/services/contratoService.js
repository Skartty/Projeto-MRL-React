import api from "./api";

export const contratoService = {
  async listar() {
    const { data } = await api.get("/contratos");
    return data;
  },

  async criar(contrato) {
    const { data } = await api.post("/contratos", contrato);
    return data;
  },

  async atualizar(id, contrato) {
    const { data } = await api.put(`/contratos/${id}`, contrato);
    return data;
  },

  async deletar(id) {
    await api.delete(`/contratos/${id}`);
  },
};