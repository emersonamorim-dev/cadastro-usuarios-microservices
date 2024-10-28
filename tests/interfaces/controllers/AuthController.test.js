const AuthController = require('../../../src/interfaces/controllers/AuthController');
const UsuarioRepository = require('../../../src/infrastructure/repositories/UsuarioRepository');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Mock dependências externas
jest.mock('../../../src/infrastructure/repositories/UsuarioRepository');
jest.mock('bcrypt');
jest.mock('jsonwebtoken');

// Mock do arquivo database.js para evitar erro de caminho
jest.mock('../../../config/database', () => ({
  host: 'mockedHost',
  user: 'mockedUser',
  password: 'mockedPassword',
  database: 'mockedDatabase',
  port: 3306,

  jwt: {
    secret: 'mockedsecret',
    expiresIn: '3600',
  },
}));

describe('AuthController', () => {
  let authController;
  let mockReq;
  let mockRes;

  beforeEach(() => {
    authController = new AuthController();

    // Mock req e res para os testes
    mockReq = {
      body: {},
    };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    // Mock do console.error para evitar mensagens no teste
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('login', () => {
    // Testes de login continuam iguais, sem necessidade de alterações
  });

  describe('register', () => {
    it('deve retornar 201 e o token JWT ao registrar um usuário com sucesso', async () => {
      const mockUsuario = { id: '123', nome: 'Emerson Amorim', cpf: '123456789' };
      mockReq.body = {
        cpf: '123456789',
        nome: 'Emerson Amorim',
        senha: 'senhaValida',
        endereco: {
          rua: 'Rua A',
          numero: '10',
          bairro: 'Bairro B',
          cidade: 'Cidade C',
          estado: 'SP',
          cep: '12345-678',
        },
      };

      // Mock para verificar CPF existente
      UsuarioRepository.prototype.findByCPF.mockResolvedValue(null);

      // Mock para criptografar a senha
      bcrypt.hash.mockResolvedValue('hashedPassword');

      // Mock para criar o usuário
      UsuarioRepository.prototype.create.mockResolvedValue(mockUsuario);

      // Mock para gerar o token JWT
      const mockToken = 'mockToken';
      jwt.sign.mockReturnValue(mockToken);

      await authController.register(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'Usuário registrado com sucesso.',
        token: mockToken,
        user: {
          id: mockUsuario.id,
          cpf: mockUsuario.cpf,
          nome: mockUsuario.nome,
        },
      });
    });

    it('deve retornar 400 quando algum campo obrigatório estiver ausente', async () => {
      mockReq.body = { cpf: '123456789' }; // Nome e senha ausentes

      await authController.register(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'CPF, nome e senha são obrigatórios.' });
    });

    it('deve retornar 409 quando o CPF já estiver registrado', async () => {
      mockReq.body = {
        cpf: '123456789',
        nome: 'Emerson Amorim',
        senha: 'senhaValida',
        endereco: {
          rua: 'Rua A',
          numero: '10',
          bairro: 'Bairro B',
          cidade: 'Cidade C',
          estado: 'SP',
          cep: '12345-678',
        },
      };

      UsuarioRepository.prototype.findByCPF.mockResolvedValue({ cpf: '123456789' });

      await authController.register(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(409);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'Usuário com este CPF já existe.' });
    });

    it('deve retornar 500 em caso de erro no processamento do registro', async () => {
      mockReq.body = {
        cpf: '123456789',
        nome: 'Emerson Amorim',
        senha: 'senhaValida',
        endereco: {
          rua: 'Rua A',
          numero: '10',
          bairro: 'Bairro B',
          cidade: 'Cidade C',
          estado: 'SP',
          cep: '12345-678',
        },
      };

      // Certifique-se de que o CPF não está registrado, então o erro será apenas na criação
      UsuarioRepository.prototype.findByCPF.mockResolvedValue(null);

      // Mock para simular um erro inesperado ao criar o usuário
      UsuarioRepository.prototype.create.mockRejectedValue(new Error('Erro inesperado'));

      await authController.register(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'Erro ao registrar o usuário.' });
    });
  });
});
