const redis = require('redis');

class CacheProvider {
  constructor(client = redis.createClient({
    socket: {
      host: process.env.REDIS_HOST || 'localhost',
      port: process.env.REDIS_PORT || 6379,
    },
  })) {
    this.client = client;

    // Inicia o cliente Redis e lida com eventos
    this.client.on('error', (err) => {
      console.error('Erro ao conectar ao Redis:', err);
    });

    this.client.connect().catch((err) => {
      console.error('Erro ao conectar ao Redis:', err);
    });
  }

  async ensureConnected() {
    if (!this.client.isOpen) {
      await this.client.connect();
    }
  }

  async get(key) {
    try {
      await this.ensureConnected();
      const data = await this.client.get(key);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error(`Erro ao obter chave ${key} do cache:`, error);
      return null;
    }
  }

  async set(key, value, expirationInSeconds = 3600) {
    try {
      await this.ensureConnected();
      await this.client.set(key, JSON.stringify(value), {
        EX: expirationInSeconds,
      });
    } catch (error) {
      console.error(`Erro ao definir chave ${key} no cache:`, error);
    }
  }

  async invalidate(key) {
    try {
      await this.ensureConnected();
      await this.client.del(key);
    } catch (error) {
      console.error(`Erro ao invalidar chave ${key} no cache:`, error);
    }
  }

  async invalidatePrefix(prefix) {
    try {
      await this.ensureConnected();
      const keys = await this.client.keys(`${prefix}*`);
      if (keys.length > 0) {
        await Promise.all(keys.map((key) => this.client.del(key)));
      }
    } catch (error) {
      console.error(`Erro ao invalidar prefixo ${prefix} no cache:`, error);
    }
  }

  async close() {
    try {
      if (this.client.isOpen) {
        await this.client.quit();
      }
    } catch (error) {
      console.error('Erro ao fechar o cliente Redis:', error);
    }
  }
}

module.exports = CacheProvider;
