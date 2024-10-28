const CacheProvider = require('../../infrastructure/cache/CacheProvider');

class GetAllUsuariosUseCase {
  constructor(usuarioRepository, cacheProvider = new CacheProvider()) {
    if (!usuarioRepository) {
      throw new Error('UsuarioRepository é obrigatório');
    }
    this.usuarioRepository = usuarioRepository;
    this.cacheProvider = cacheProvider;
  }

  async execute() {
    const cachedUsuarios = await this.cacheProvider.get('usuarios');

    if (cachedUsuarios) {
      return cachedUsuarios;
    }

    const usuarios = await this.usuarioRepository.findAll();
    await this.cacheProvider.set('usuarios', usuarios);

    return usuarios;
  }
}

module.exports = GetAllUsuariosUseCase;


