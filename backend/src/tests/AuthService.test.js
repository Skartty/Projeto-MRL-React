const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const AuthService = require("../application/services/AuthService");

process.env.JWT_SECRET = "test_secret";
process.env.JWT_EXPIRES_IN = "1d";

const criarRepositorioMock = () => ({
  buscarPorEmail: jest.fn(),
  criar: jest.fn(),
});

const criarService = () => {
  const repository = criarRepositorioMock();
  const service = new AuthService(repository);

  return { repository, service };
};

// Objetivo: agrupar os testes do servico de autenticacao.
// Comportamento validado: cadastro, login e rejeicao de credenciais invalidas.
// Importancia: protege o fluxo de acesso ao sistema, que e essencial para seguranca e controle de usuarios.
describe("AuthService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Objetivo: confirmar que um usuario novo pode ser cadastrado.
  // Comportamento validado: o servico consulta duplicidade, salva a senha com hash e retorna token de acesso.
  // Importancia: garante que novos usuarios entram no sistema sem expor a senha original.
  test("deve cadastrar novo usuario e retornar token com dados publicos", async () => {
    const { repository, service } = criarService();
    const dadosCadastro = {
      nome: "Teste",
      email: "teste@email.com",
      senha: "Teste@123",
    };

    repository.buscarPorEmail.mockResolvedValue(null);
    repository.criar.mockResolvedValue({
      id: 1,
      nome: dadosCadastro.nome,
      email: dadosCadastro.email,
    });

    const resultado = await service.cadastrar(dadosCadastro);

    expect(repository.buscarPorEmail).toHaveBeenCalledWith(dadosCadastro.email);
    expect(repository.criar).toHaveBeenCalledWith(
      expect.objectContaining({
        nome: dadosCadastro.nome,
        email: dadosCadastro.email,
        cargo: "Cliente",
        role: "cliente",
      })
    );
    expect(repository.criar.mock.calls[0][0].senha).not.toBe(dadosCadastro.senha);
    expect(resultado.token).toBeDefined();
    expect(jwt.verify(resultado.token, process.env.JWT_SECRET)).toMatchObject({
      id: 1,
      role: "cliente",
    });
    expect(resultado.usuario).toEqual({
      id: 1,
      nome: dadosCadastro.nome,
      email: dadosCadastro.email,
      cargo: "Cliente",
      role: "cliente",
    });
  });

  // Objetivo: impedir cadastro quando o e-mail ja existe.
  // Comportamento validado: o servico interrompe o fluxo antes de criar outro registro.
  // Importancia: evita contas duplicadas e mantem o e-mail como identificador confiavel do usuario.
  test("deve rejeitar cadastro com e-mail ja cadastrado", async () => {
    const { repository, service } = criarService();

    repository.buscarPorEmail.mockResolvedValue({ id: 1 });

    await expect(
      service.cadastrar({
        nome: "Usuario Existente",
        email: "ja@existe.com",
        senha: "Teste@123",
      })
    ).rejects.toThrow("E-mail já cadastrado.");
    expect(repository.criar).not.toHaveBeenCalled();
  });

  // Objetivo: validar o login com credenciais corretas.
  // Comportamento validado: o servico localiza o usuario, compara a senha com hash e emite token autenticado.
  // Importancia: confirma que usuarios validos conseguem acessar a aplicacao sem depender do banco real no teste.
  test("deve fazer login com credenciais corretas", async () => {
    const { repository, service } = criarService();
    const senhaHash = await bcrypt.hash("123456", 10);

    repository.buscarPorEmail.mockResolvedValue({
      id: 1,
      nome: "Teste",
      email: "teste@email.com",
      senha: senhaHash,
      cargo: "Admin",
      role: "admin",
    });

    const resultado = await service.login({
      email: "TESTE@EMAIL.COM",
      senha: "123456",
    });

    expect(repository.buscarPorEmail).toHaveBeenCalledWith("teste@email.com");
    expect(resultado.token).toBeDefined();
    expect(jwt.verify(resultado.token, process.env.JWT_SECRET)).toMatchObject({
      id: 1,
      role: "admin",
    });
    expect(resultado.usuario).toEqual({
      id: 1,
      nome: "Teste",
      email: "teste@email.com",
      cargo: "Admin",
      role: "admin",
    });
  });

  // Objetivo: garantir que senha incorreta bloqueia o login.
  // Comportamento validado: o servico compara a senha informada com o hash salvo e retorna erro quando nao confere.
  // Importancia: protege contas cadastradas contra acesso com credenciais invalidas.
  test("deve rejeitar login com senha incorreta", async () => {
    const { repository, service } = criarService();
    const senhaHash = await bcrypt.hash("senhaCorreta", 10);

    repository.buscarPorEmail.mockResolvedValue({
      id: 1,
      email: "teste@email.com",
      senha: senhaHash,
    });

    await expect(
      service.login({ email: "teste@email.com", senha: "senhaErrada" })
    ).rejects.toThrow("Senha incorreta");
  });
});
