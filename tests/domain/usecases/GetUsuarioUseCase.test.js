const GetUsuarioUseCase = require('../../../src/domain/usecases/GetUsuarioUseCase');
const UsuarioRepository = require('../../../src/infrastructure/repositories/UsuarioRepository');
const CacheProvider = require('../../../src/infrastructure/cache/CacheProvider');

// Mock dependências externas
jest.mock('../../../src/infrastructure/repositories/UsuarioRepository');
jest.mock('../../../src/infrastructure/cache/CacheProvider');

describe('GetUsuarioUseCase', () => {
  let getUsuarioUseCase;
  let usuarioRepositoryMock;
  let cacheProviderMock;

  beforeEach(() => {
    usuarioRepositoryMock = new UsuarioRepository();
    cacheProviderMock = new CacheProvider();
    getUsuarioUseCase = new GetUsuarioUseCase(usuarioRepositoryMock, cacheProviderMock);

    // Mock métodos
    usuarioRepositoryMock.findById = jest.fn();
    cacheProviderMock.get = jest.fn();
    cacheProviderMock.set = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('deve retornar o usuário do cache', async () => {
    const usuarioId = 1;
    const usuario = { id: usuarioId, nome: 'Emerson Amorim', cpf: '12345678900' };

    // Simulando que o usuário está em cache
    cacheProviderMock.get.mockResolvedValue(usuario);

    const result = await getUsuarioUseCase.execute(usuarioId);

    // Verificações
    expect(cacheProviderMock.get).toHaveBeenCalledTimes(1);
    expect(cacheProviderMock.get).toHaveBeenCalledWith(`usuario:${usuarioId}`);
    expect(usuarioRepositoryMock.findById).not.toHaveBeenCalled();
    expect(result).toEqual(usuario);
  });

  it('deve buscar o usuário do repositório quando não estiver em cache e setar no cache', async () => {
    const usuarioId = 1;
    const usuario = { id: usuarioId, nome: 'Emerson Amorim', cpf: '12345678900' };

    // Simulando que o cache está vazio
    cacheProviderMock.get.mockResolvedValue(null);
    usuarioRepositoryMock.findById.mockResolvedValue(usuario);
    cacheProviderMock.set.mockResolvedValue();

    const result = await getUsuarioUseCase.execute(usuarioId);

    // Verificações
    expect(cacheProviderMock.get).toHaveBeenCalledTimes(1);
    expect(cacheProviderMock.get).toHaveBeenCalledWith(`usuario:${usuarioId}`);
    expect(usuarioRepositoryMock.findById).toHaveBeenCalledTimes(1);
    expect(usuarioRepositoryMock.findById).toHaveBeenCalledWith(usuarioId);
    expect(cacheProviderMock.set).toHaveBeenCalledTimes(1);
    expect(cacheProviderMock.set).toHaveBeenCalledWith(`usuario:${usuarioId}`, usuario);
    expect(result).toEqual(usuario);
  });

  it('deve retornar null quando o usuário não for encontrado no repositório', async () => {
    const usuarioId = 1;

    // Simulando que o cache está vazio e que o repositório não possui o usuário
    cacheProviderMock.get.mockResolvedValue(null);
    usuarioRepositoryMock.findById.mockResolvedValue(null);
    cacheProviderMock.set.mockResolvedValue();

    const result = await getUsuarioUseCase.execute(usuarioId);

    // Verificações
    expect(cacheProviderMock.get).toHaveBeenCalledTimes(1);
    expect(cacheProviderMock.get).toHaveBeenCalledWith(`usuario:${usuarioId}`);
    expect(usuarioRepositoryMock.findById).toHaveBeenCalledTimes(1);
    expect(usuarioRepositoryMock.findById).toHaveBeenCalledWith(usuarioId);
    expect(cacheProviderMock.set).not.toHaveBeenCalled();
    expect(result).toBeNull();
  });
});
