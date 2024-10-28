const DeleteUsuarioUseCase = require('../../../src/domain/usecases/DeleteUsuarioUseCase');
const UsuarioRepository = require('../../../src/infrastructure/repositories/UsuarioRepository');
const CacheProvider = require('../../../src/infrastructure/cache/CacheProvider');

// Mock dependências externas
jest.mock('../../../src/infrastructure/repositories/UsuarioRepository');
jest.mock('../../../src/infrastructure/cache/CacheProvider');

describe('DeleteUsuarioUseCase', () => {
  let deleteUsuarioUseCase;
  let usuarioRepositoryMock;
  let cacheProviderMock;

  beforeEach(() => {
    usuarioRepositoryMock = new UsuarioRepository();
    cacheProviderMock = new CacheProvider();
    deleteUsuarioUseCase = new DeleteUsuarioUseCase(usuarioRepositoryMock);

    // Mock métodos
    usuarioRepositoryMock.delete = jest.fn();
    cacheProviderMock.invalidate = jest.fn().mockResolvedValue();

    // Injetar os mocks na instância do caso de uso
    deleteUsuarioUseCase.cacheProvider = cacheProviderMock;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('deve deletar um usuário com sucesso e invalidar o cache', async () => {
    const usuarioId = 1;
    const deletedBy = 'adminUser';

    // Simulando que o usuário foi deletado com sucesso
    usuarioRepositoryMock.delete.mockResolvedValue(true);

    const result = await deleteUsuarioUseCase.execute(usuarioId, deletedBy);

    expect(usuarioRepositoryMock.delete).toHaveBeenCalledWith(usuarioId, deletedBy);
    expect(cacheProviderMock.invalidate).toHaveBeenCalledTimes(2);
    expect(cacheProviderMock.invalidate).toHaveBeenCalledWith(`usuario:${usuarioId}`);
    expect(cacheProviderMock.invalidate).toHaveBeenCalledWith('usuarios');
    expect(result).toBe(true);
  });

  it('não deve invalidar o cache se o usuário não for deletado', async () => {
    const usuarioId = 1;
    const deletedBy = 'adminUser';

    // Simulando que o usuário não foi deletado
    usuarioRepositoryMock.delete.mockResolvedValue(false);

    const result = await deleteUsuarioUseCase.execute(usuarioId, deletedBy);

    expect(usuarioRepositoryMock.delete).toHaveBeenCalledWith(usuarioId, deletedBy);
    expect(cacheProviderMock.invalidate).not.toHaveBeenCalled();
    expect(result).toBe(false);
  });

  it('deve lançar um erro se ocorrer uma exceção no repositório', async () => {
    const usuarioId = 1;
    const deletedBy = 'adminUser';

    // Simulando um erro ao tentar deletar o usuário
    usuarioRepositoryMock.delete.mockRejectedValue(new Error('Erro ao deletar usuário'));

    await expect(deleteUsuarioUseCase.execute(usuarioId, deletedBy)).rejects.toThrow('Erro ao deletar usuário');
    expect(usuarioRepositoryMock.delete).toHaveBeenCalledWith(usuarioId, deletedBy);
    expect(cacheProviderMock.invalidate).not.toHaveBeenCalled();
  });
});
