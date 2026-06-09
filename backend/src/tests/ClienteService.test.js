const ClienteService = require("../application/services/ClienteService");

const criarRepositorioMock = () => ({
  buscarTodos: jest.fn(),
  buscarPorId: jest.fn(),
  criar: jest.fn(),
  atualizar: jest.fn(),
  deletar: jest.fn(),
});

const criarService = () => {
  const repository = criarRepositorioMock();
  const service = new ClienteService(repository);

  return { repository, service };
};

// Objetivo: agrupar os testes do servico de clientes.
// Comportamento validado: consulta, criacao, atualizacao, exclusao e tratamento de registros inexistentes.
// Importancia: protege as regras de negocio de clientes sem depender de banco de dados ou rotas HTTP.
describe("ClienteService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Objetivo: verificar a listagem de clientes cadastrados.
  // Comportamento validado: o servico delega a busca ao repositorio e retorna a lista recebida.
  // Importancia: garante que a tela ou API de clientes consiga exibir os dados persistidos.
  test("deve listar clientes retornados pelo repositorio", async () => {
    const { repository, service } = criarService();
    const clientes = [{ id: 1, nome: "Cliente Teste" }];

    repository.buscarTodos.mockResolvedValue(clientes);

    const resultado = await service.listar();

    expect(repository.buscarTodos).toHaveBeenCalledTimes(1);
    expect(resultado).toEqual(clientes);
  });

  // Objetivo: confirmar a criacao de um cliente valido.
  // Comportamento validado: o servico valida os dados e envia uma entidade normalizada ao repositorio.
  // Importancia: evita que clientes invalidos sejam persistidos e preserva a qualidade dos dados do sistema.
  test("deve criar cliente valido", async () => {
    const { repository, service } = criarService();
    const dados = {
      nome: "Joao Silva",
      cpfCnpj: "123.456.789-00",
      status: "ativo",
    };

    repository.criar.mockResolvedValue({ id: 1, ...dados });

    const resultado = await service.criar(dados);

    expect(repository.criar).toHaveBeenCalledWith(
      expect.objectContaining({
        nome: dados.nome,
        cpfCnpj: dados.cpfCnpj,
        status: dados.status,
      })
    );
    expect(resultado).toEqual({ id: 1, ...dados });
  });

  // Objetivo: impedir a criacao de cliente sem nome.
  // Comportamento validado: a validacao da entidade falha antes de chamar o repositorio.
  // Importancia: o nome e informacao minima para identificar o cliente nos fluxos do sistema.
  test("deve rejeitar criacao de cliente sem nome", async () => {
    const { repository, service } = criarService();

    await expect(
      service.criar({ nome: "", cpfCnpj: "123.456.789-00", status: "ativo" })
    ).rejects.toThrow("Nome é obrigatório.");
    expect(repository.criar).not.toHaveBeenCalled();
  });

  // Objetivo: sinalizar quando um cliente nao existe.
  // Comportamento validado: o servico transforma retorno nulo do repositorio em erro de negocio.
  // Importancia: impede que controllers ou telas tratem uma ausencia de cliente como operacao bem-sucedida.
  test("deve lancar erro ao buscar cliente inexistente", async () => {
    const { repository, service } = criarService();

    repository.buscarPorId.mockResolvedValue(null);

    await expect(service.buscarPorId(999)).rejects.toThrow("Cliente não encontrado.");
    expect(repository.buscarPorId).toHaveBeenCalledWith(999);
  });

  // Objetivo: validar a atualizacao de um cliente existente.
  // Comportamento validado: o servico confirma a existencia antes de validar e atualizar os dados.
  // Importancia: evita atualizacoes em registros inexistentes e preserva a consistencia da base.
  test("deve atualizar cliente existente com dados validos", async () => {
    const { repository, service } = criarService();
    const dadosAtualizados = {
      nome: "Joao Atualizado",
      cpfCnpj: "123.456.789-00",
      status: "suspenso",
    };

    repository.buscarPorId.mockResolvedValue({ id: 1, nome: "Joao Silva" });
    repository.atualizar.mockResolvedValue({ id: 1, ...dadosAtualizados });

    const resultado = await service.atualizar(1, dadosAtualizados);

    expect(repository.buscarPorId).toHaveBeenCalledWith(1);
    expect(repository.atualizar).toHaveBeenCalledWith(
      1,
      expect.objectContaining({ id: 1, ...dadosAtualizados })
    );
    expect(resultado).toEqual({ id: 1, ...dadosAtualizados });
  });

  // Objetivo: confirmar a exclusao de um cliente existente.
  // Comportamento validado: o servico verifica se o cliente existe e entao delega a exclusao ao repositorio.
  // Importancia: garante que a remocao respeite a regra de nao excluir registros que nao foram encontrados.
  test("deve deletar cliente existente", async () => {
    const { repository, service } = criarService();

    repository.buscarPorId.mockResolvedValue({ id: 1, nome: "Joao" });
    repository.deletar.mockResolvedValue(true);

    const resultado = await service.deletar(1);

    expect(repository.buscarPorId).toHaveBeenCalledWith(1);
    expect(repository.deletar).toHaveBeenCalledWith(1);
    expect(resultado).toBe(true);
  });
});
