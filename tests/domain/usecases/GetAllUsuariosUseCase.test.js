const GetAllUsuariosUseCase = require('../../../src/domain/usecases/GetAllUsuariosUseCase');
const UsuarioRepository = require('../../../src/infrastructure/repositories/UsuarioRepository');
const CacheProvider = require('../../../src/infrastructure/cache/CacheProvider');

// Mock dependências externas
jest.mock('../../../src/infrastructure/repositories/UsuarioRepository');
jest.mock('../../../src/infrastructure/cache/CacheProvider');

describe('GetAllUsuariosUseCase', () => {
  let getAllUsuariosUseCase;
  let usuarioRepositoryMock;
  let cacheProviderMock;

  beforeEach(() => {
    usuarioRepositoryMock = new UsuarioRepository();
    cacheProviderMock = new CacheProvider();
    getAllUsuariosUseCase = new GetAllUsuariosUseCase(usuarioRepositoryMock, cacheProviderMock);

    // Mock métodos
    usuarioRepositoryMock.findAll = jest.fn();
    cacheProviderMock.get = jest.fn();
    cacheProviderMock.set = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('deve retornar todos os usuários do cache', async () => {
    const usuarios = [
      { id: 1, nome: 'Emerson Amorim', cpf: '12345678900' },
      { id: 2, nome: 'Emerson Luiz', cpf: '09876543211' },
    ];

    // Simulando que os usuários estão em cache
    cacheProviderMock.get.mockResolvedValue(usuarios);

    const result = await getAllUsuariosUseCase.execute();

    // Verificações
    expect(cacheProviderMock.get).toHaveBeenCalledTimes(1);
    expect(cacheProviderMock.get).toHaveBeenCalledWith('usuarios');
    expect(usuarioRepositoryMock.findAll).not.toHaveBeenCalled();
    expect(result).toEqual(usuarios);
  });

  it('deve buscar todos os usuários do repositório quando não estiverem em cache e setar no cache', async () => {
    const usuarios = [
      { id: 1, nome: 'Emerson Amorim', cpf: '12345678900' },
      { id: 2, nome: 'Maria Silva', cpf: '09876543211' },
    ];

    // Simulando que o cache está vazio
    cacheProviderMock.get.mockResolvedValue(null);
    usuarioRepositoryMock.findAll.mockResolvedValue(usuarios);
    cacheProviderMock.set.mockResolvedValue();

    const result = await getAllUsuariosUseCase.execute();

    // Verificações
    expect(cacheProviderMock.get).toHaveBeenCalledTimes(1);
    expect(cacheProviderMock.get).toHaveBeenCalledWith('usuarios');
    expect(usuarioRepositoryMock.findAll).toHaveBeenCalledTimes(1);
    expect(cacheProviderMock.set).toHaveBeenCalledTimes(1);
    expect(cacheProviderMock.set).toHaveBeenCalledWith('usuarios', usuarios);
    expect(result).toEqual(usuarios);
  });

  it('deve retornar uma lista vazia quando não houver usuários no repositório', async () => {
    // Simulando que o cache está vazio e que o repositório não possui usuários
    cacheProviderMock.get.mockResolvedValue(null);
    usuarioRepositoryMock.findAll.mockResolvedValue([]);
    cacheProviderMock.set.mockResolvedValue();

    const result = await getAllUsuariosUseCase.execute();

    // Verificações
    expect(cacheProviderMock.get).toHaveBeenCalledTimes(1);
    expect(cacheProviderMock.get).toHaveBeenCalledWith('usuarios');
    expect(usuarioRepositoryMock.findAll).toHaveBeenCalledTimes(1);
    expect(cacheProviderMock.set).toHaveBeenCalledTimes(1);
    expect(cacheProviderMock.set).toHaveBeenCalledWith('usuarios', []);
    expect(result).toEqual([]);
  });
});
