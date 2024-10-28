const CacheProvider = require('../../../src/infrastructure/cache/CacheProvider');
const redis = require('redis');

// Mock do cliente Redis
jest.mock('redis', () => {
  const originalModule = jest.requireActual('redis');
  return {
    ...originalModule,
    createClient: jest.fn().mockImplementation(() => {
      return {
        on: jest.fn(),
        connect: jest.fn().mockResolvedValue(),
        get: jest.fn(),
        set: jest.fn(),
        del: jest.fn(),
        keys: jest.fn(),
        isOpen: true,
        quit: jest.fn(),
      };
    }),
  };
});

describe('CacheProvider', () => {
  let cacheProvider;
  let redisClientMock;

  beforeEach(() => {
    redisClientMock = redis.createClient();
    cacheProvider = new CacheProvider(redisClientMock);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('deve obter um valor do cache', async () => {
    const key = 'usuario:1';
    const value = { id: 1, nome: 'Emerson Amorim', cpf: '12345678900' };

    // Simulando que o valor está no cache
    redisClientMock.get.mockResolvedValue(JSON.stringify(value));

    const result = await cacheProvider.get(key);

    // Verificações
    expect(redisClientMock.get).toHaveBeenCalledTimes(1);
    expect(redisClientMock.get).toHaveBeenCalledWith(key);
    expect(result).toEqual(value);
  });

  it('deve retornar null quando o valor não estiver no cache', async () => {
    const key = 'usuario:1';

    // Simulando que o valor não está no cache
    redisClientMock.get.mockResolvedValue(null);

    const result = await cacheProvider.get(key);

    // Verificações
    expect(redisClientMock.get).toHaveBeenCalledTimes(1);
    expect(redisClientMock.get).toHaveBeenCalledWith(key);
    expect(result).toBeNull();
  });

  it('deve definir um valor no cache', async () => {
    const key = 'usuario:1';
    const value = { id: 1, nome: 'Emerson Amorim', cpf: '12345678900' };
    const expirationInSeconds = 3600;

    // Simulando que o valor foi definido no cache
    redisClientMock.set.mockResolvedValue();

    await cacheProvider.set(key, value, expirationInSeconds);

    // Verificações
    expect(redisClientMock.set).toHaveBeenCalledTimes(1);
    expect(redisClientMock.set).toHaveBeenCalledWith(key, JSON.stringify(value), { EX: expirationInSeconds });
  });

  it('deve invalidar uma chave no cache', async () => {
    const key = 'usuario:1';

    // Simulando que a chave foi invalidada no cache
    redisClientMock.del.mockResolvedValue();

    await cacheProvider.invalidate(key);

    // Verificações
    expect(redisClientMock.del).toHaveBeenCalledTimes(1);
    expect(redisClientMock.del).toHaveBeenCalledWith(key);
  });

  it('deve invalidar chaves com um prefixo no cache', async () => {
    const prefix = 'usuario';
    const keys = ['usuario:1', 'usuario:2'];

    // Simulando que as chaves com o prefixo foram encontradas e invalidadas
    redisClientMock.keys.mockResolvedValue(keys);
    redisClientMock.del.mockResolvedValue();

    await cacheProvider.invalidatePrefix(prefix);

    // Verificações
    expect(redisClientMock.keys).toHaveBeenCalledTimes(1);
    expect(redisClientMock.keys).toHaveBeenCalledWith(`${prefix}*`);
    expect(redisClientMock.del).toHaveBeenCalledTimes(keys.length);
    keys.forEach((key) => {
      expect(redisClientMock.del).toHaveBeenCalledWith(key);
    });
  });

  it('deve fechar o cliente Redis', async () => {
    // Simulando que o cliente Redis foi fechado
    redisClientMock.quit.mockResolvedValue();

    await cacheProvider.close();

    // Verificações
    expect(redisClientMock.quit).toHaveBeenCalledTimes(1);
  });
});
