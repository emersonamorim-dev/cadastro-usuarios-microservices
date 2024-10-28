const CacheProvider = require('../../infrastructure/cache/CacheProvider');

class DeleteUsuarioUseCase {
  constructor(usuarioRepository) {
    this.usuarioRepository = usuarioRepository; 
    this.cacheProvider = new CacheProvider();
  }

  async execute(usuarioId, deletedBy) {
    const success = await this.usuarioRepository.delete(usuarioId, deletedBy);

    if (success) {
      // Invalida o cache
      await this.cacheProvider.invalidate(`usuario:${usuarioId}`);
      await this.cacheProvider.invalidate('usuarios');
    }

    return success;
  }
}

module.exports = DeleteUsuarioUseCase; 
