const CacheProvider = require('../../infrastructure/cache/CacheProvider');

class GetUsuarioUseCase {
  constructor(usuarioRepository, cacheProvider = new CacheProvider()) {
    if (!usuarioRepository) {
      throw new Error('UsuarioRepository é obrigatório');
    }
    this.usuarioRepository = usuarioRepository;
    this.cacheProvider = cacheProvider;
  }

  async execute(usuarioId) {
    let usuario = await this.cacheProvider.get(`usuario:${usuarioId}`);

    if (!usuario) {
      // Se não estiver no cache, busca no banco de dados
      usuario = await this.usuarioRepository.findById(usuarioId);

      if (usuario) {
        await this.cacheProvider.set(`usuario:${usuarioId}`, usuario);
      }
    }

    return usuario;
  }
}

module.exports = GetUsuarioUseCase;


