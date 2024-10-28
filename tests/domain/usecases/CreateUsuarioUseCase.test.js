const CreateUsuarioUseCase = require('../../../src/domain/usecases/CreateUsuarioUseCase');
const UsuarioRepository = require('../../../src/infrastructure/repositories/UsuarioRepository');
const CacheProvider = require('../../../src/infrastructure/cache/CacheProvider');
const bcrypt = require('bcrypt');

// Mock dependências externas
jest.mock('../../../src/infrastructure/repositories/UsuarioRepository');
jest.mock('../../../src/infrastructure/cache/CacheProvider');
jest.mock('bcrypt');

describe('CreateUsuarioUseCase', () => {
  let createUsuarioUseCase;
  let usuarioRepositoryMock;
  let cacheProviderMock;

  beforeEach(() => {
    usuarioRepositoryMock = new UsuarioRepository();
    cacheProviderMock = new CacheProvider();
    createUsuarioUseCase = new CreateUsuarioUseCase();

    // Mock métodos
    usuarioRepositoryMock.findByCPF = jest.fn();
    usuarioRepositoryMock.create = jest.fn();
    cacheProviderMock.invalidate = jest.fn();
    bcrypt.hash = jest.fn();

    // Injetar os mocks na instância do caso de uso
    createUsuarioUseCase.usuarioRepository = usuarioRepositoryMock;
    createUsuarioUseCase.cacheProvider = cacheProviderMock;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('deve criar um novo usuário com sucesso', async () => {
    const userData = {
      cpf: '12345678900',
      nome: 'Emerson Amorim',
      senha: 'senhaSegura',
      endereco: {
        rua: 'Rua A',
        numero: '123',
        bairro: 'Bairro B',
        cidade: 'Cidade C',
        estado: 'SP',
        cep: '12345-678',
      },
    };

    // Simulando comportamento de sucesso
    usuarioRepositoryMock.findByCPF.mockResolvedValue(null);
    bcrypt.hash.mockResolvedValue('hashedPassword');
    usuarioRepositoryMock.create.mockResolvedValue({ id: 1, ...userData, senhaHash: 'hashedPassword' });

    const result = await createUsuarioUseCase.execute(userData);

    // Removendo o campo 'senha' do objeto resultante
    delete result.senha;

    // Removendo o campo 'senha' do objeto esperado
    const expectedUserData = { ...userData };
    delete expectedUserData.senha;

    expect(usuarioRepositoryMock.findByCPF).toHaveBeenCalledWith(userData.cpf);
    expect(bcrypt.hash).toHaveBeenCalledWith('senhaSegura', 10);
    expect(usuarioRepositoryMock.create).toHaveBeenCalledWith({
      ...expectedUserData,
      senhaHash: 'hashedPassword',
    });
    expect(cacheProviderMock.invalidate).toHaveBeenCalledWith('users');
    expect(result).toEqual({ id: 1, ...expectedUserData, senhaHash: 'hashedPassword' });
  });

  it('deve lançar um erro quando os dados do usuário são inválidos', async () => {
    await expect(createUsuarioUseCase.execute({})).rejects.toThrow('Dados de usuário inválidos');
  });

  it('deve lançar um erro quando o CPF já estiver cadastrado', async () => {
    const userData = {
      cpf: '12345678900',
      nome: 'Emerson Amorim',
      senha: 'senhaSegura',
    };

    // Simulando que o CPF já existe
    usuarioRepositoryMock.findByCPF.mockResolvedValue({ id: 1, cpf: userData.cpf });

    await expect(createUsuarioUseCase.execute(userData)).rejects.toThrow('Usuário com esse CPF já existe');
    expect(usuarioRepositoryMock.findByCPF).toHaveBeenCalledWith(userData.cpf);
  });

  it('deve lançar um erro quando falhar ao criar o usuário', async () => {
    const userData = {
      cpf: '12345678900',
      nome: 'Emerson Amorim',
      senha: 'senhaSegura',
      endereco: {
        rua: 'Rua A',
        numero: '123',
        bairro: 'Bairro B',
        cidade: 'Cidade C',
        estado: 'SP',
        cep: '12345-678',
      },
    };

    usuarioRepositoryMock.findByCPF.mockResolvedValue(null);
    bcrypt.hash.mockResolvedValue('hashedPassword');
    // Simulando falha ao criar o usuário (retornando null ou undefined para simular falha)
    usuarioRepositoryMock.create.mockResolvedValue(null);

    await expect(createUsuarioUseCase.execute(userData)).rejects.toThrow('Falha ao criar usuário');
    expect(usuarioRepositoryMock.findByCPF).toHaveBeenCalledWith(userData.cpf);
    expect(usuarioRepositoryMock.create).toHaveBeenCalledWith({
      ...userData,
      senhaHash: 'hashedPassword',
    });
  });
});
