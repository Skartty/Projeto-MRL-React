const AuthService = require("../../../application/services/AuthService");
const bcrypt = require("bcryptjs");

process.env.JWT_SECRET = "test_secret";
process.env.JWT_EXPIRES_IN = "1d";

const mockRepository = {
  buscarPorEmail: jest.fn(),
  criar: jest.fn(),
};

const service = new AuthService(mockRepository);

describe("AuthService", () => {
  beforeEach(() => jest.clearAllMocks());

  test("deve cadastrar novo usuário", async () => {
    mockRepository.buscarPorEmail.mockResolvedValue(null);
    mockRepository.criar.mockResolvedValue({ id: 1, nome: "Teste", email: "teste@email.com" });

    const resultado = await service.cadastrar({
      nome: "Teste", email: "teste@email.com", senha: "123456",
    });

    expect(resultado.token).toBeDefined();
    expect(resultado.usuario.email).toBe("teste@email.com");
  });

  test("deve rejeitar e-mail já cadastrado", async () => {
    mockRepository.buscarPorEmail.mockResolvedValue({ id: 1 });
    await expect(service.cadastrar({ nome: "X", email: "ja@existe.com", senha: "123456" }))
      .rejects.toThrow("E-mail já cadastrado.");
  });

  test("deve fazer login com credenciais corretas", async () => {
    const senhaHash = await bcrypt.hash("123456", 10);
    mockRepository.buscarPorEmail.mockResolvedValue({
      id: 1, nome: "Teste", email: "teste@email.com", senha: senhaHash, cargo: "Admin",
    });

    const resultado = await service.login({ email: "teste@email.com", senha: "123456" });
    expect(resultado.token).toBeDefined();
  });

  test("deve rejeitar login com senha errada", async () => {
    const senhaHash = await bcrypt.hash("senhaCorreta", 10);
    mockRepository.buscarPorEmail.mockResolvedValue({ id: 1, senha: senhaHash });
    await expect(service.login({ email: "teste@email.com", senha: "senhaErrada" }))
      .rejects.toThrow("E-mail ou senha inválidos.");
  });
});