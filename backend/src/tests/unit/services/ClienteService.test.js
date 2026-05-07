const ClienteService = require("../../../application/services/ClienteService");

const mockRepository = {
  buscarTodos: jest.fn(),
  buscarPorId: jest.fn(),
  criar: jest.fn(),
  atualizar: jest.fn(),
  deletar: jest.fn(),
};

const service = new ClienteService(mockRepository);

describe("ClienteService", () => {
  beforeEach(() => jest.clearAllMocks());

  test("deve listar clientes", async () => {
    mockRepository.buscarTodos.mockResolvedValue([{ id: 1, nome: "Teste" }]);
    const resultado = await service.listar();
    expect(resultado).toHaveLength(1);
  });

  test("deve criar cliente válido", async () => {
    const dados = { nome: "João Silva", cpfCnpj: "123.456.789-00", status: "ativo" };
    mockRepository.criar.mockResolvedValue({ id: 1, ...dados });
    const resultado = await service.criar(dados);
    expect(resultado.nome).toBe("João Silva");
  });

  test("deve rejeitar cliente sem nome", async () => {
    await expect(service.criar({ nome: "", cpfCnpj: "123", status: "ativo" }))
      .rejects.toThrow("Nome é obrigatório.");
  });

  test("deve lançar erro ao buscar cliente inexistente", async () => {
    mockRepository.buscarPorId.mockResolvedValue(null);
    await expect(service.buscarPorId(999)).rejects.toThrow("Cliente não encontrado.");
  });

  test("deve deletar cliente existente", async () => {
    mockRepository.buscarPorId.mockResolvedValue({ id: 1, nome: "João" });
    mockRepository.deletar.mockResolvedValue(true);
    const resultado = await service.deletar(1);
    expect(resultado).toBe(true);
  });
});