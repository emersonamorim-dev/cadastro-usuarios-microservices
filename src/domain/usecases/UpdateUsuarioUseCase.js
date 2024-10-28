const CacheProvider = require('../../infrastructure/cache/CacheProvider');

class UpdateUsuarioUseCase {
  constructor(usuarioRepository, cacheProvider = new CacheProvider()) {
    this.usuarioRepository = usuarioRepository;
    this.cacheProvider = cacheProvider;
  }

  async execute(usuarioId, updateData) {
    const usuario = await this.usuarioRepository.update(usuarioId, updateData);

    if (usuario) {
      // Atualiza o cache
      await this.cacheProvider.set(`usuario:${usuarioId}`, usuario);
      await this.cacheProvider.invalidate('usuarios');
    }

    return usuario;
  }
}

module.exports = UpdateUsuarioUseCase;
