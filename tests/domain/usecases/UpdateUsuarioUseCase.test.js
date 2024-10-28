const UpdateUsuarioUseCase = require('../../../src/domain/usecases/UpdateUsuarioUseCase');
const UsuarioRepository = require('../../../src/infrastructure/repositories/UsuarioRepository');
const CacheProvider = require('../../../src/infrastructure/cache/CacheProvider');

// Mock dependências externas
jest.mock('../../../src/infrastructure/repositories/UsuarioRepository');
jest.mock('../../../src/infrastructure/cache/CacheProvider');

describe('UpdateUsuarioUseCase', () => {
  let updateUsuarioUseCase;
  let usuarioRepositoryMock;
  let cacheProviderMock;

  beforeEach(() => {
    usuarioRepositoryMock = new UsuarioRepository();
    cacheProviderMock = new CacheProvider();
    updateUsuarioUseCase = new UpdateUsuarioUseCase(usuarioRepositoryMock, cacheProviderMock);

    // Mock métodos
    usuarioRepositoryMock.update = jest.fn();
    cacheProviderMock.set = jest.fn();
    cacheProviderMock.invalidate = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('deve atualizar o usuário no repositório e no cache', async () => {
    const usuarioId = 1;
    const updateData = { nome: 'Emerson Amorim', cpf: '12345678900' };
    const usuarioAtualizado = { id: usuarioId, ...updateData };

    // Simulando que o usuário foi atualizado no repositório
    usuarioRepositoryMock.update.mockResolvedValue(usuarioAtualizado);
    cacheProviderMock.set.mockResolvedValue();
    cacheProviderMock.invalidate.mockResolvedValue();

    const result = await updateUsuarioUseCase.execute(usuarioId, updateData);

    // Verificações
    expect(usuarioRepositoryMock.update).toHaveBeenCalledTimes(1);
    expect(usuarioRepositoryMock.update).toHaveBeenCalledWith(usuarioId, updateData);
    expect(cacheProviderMock.set).toHaveBeenCalledTimes(1);
    expect(cacheProviderMock.set).toHaveBeenCalledWith(`usuario:${usuarioId}`, usuarioAtualizado);
    expect(cacheProviderMock.invalidate).toHaveBeenCalledTimes(1);
    expect(cacheProviderMock.invalidate).toHaveBeenCalledWith('usuarios');
    expect(result).toEqual(usuarioAtualizado);
  });

  it('deve retornar null quando o usuário não for encontrado no repositório', async () => {
    const usuarioId = 1;
    const updateData = { nome: 'Emerson Amorim', cpf: '12345678900' };

    // Simulando que o usuário não foi encontrado no repositório
    usuarioRepositoryMock.update.mockResolvedValue(null);
    cacheProviderMock.set.mockResolvedValue();
    cacheProviderMock.invalidate.mockResolvedValue();

    const result = await updateUsuarioUseCase.execute(usuarioId, updateData);

    // Verificações
    expect(usuarioRepositoryMock.update).toHaveBeenCalledTimes(1);
    expect(usuarioRepositoryMock.update).toHaveBeenCalledWith(usuarioId, updateData);
    expect(cacheProviderMock.set).not.toHaveBeenCalled();
    expect(cacheProviderMock.invalidate).not.toHaveBeenCalled();
    expect(result).toBeNull();
  });
});
