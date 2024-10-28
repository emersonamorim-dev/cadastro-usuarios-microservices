const UsuarioRepository = require('@src/infrastructure/repositories/UsuarioRepository');
const CacheProvider = require('@src/infrastructure/cache/CacheProvider');
const bcrypt = require('bcrypt');

class CreateUsuarioUseCase {
  constructor() {
    this.usuarioRepository = new UsuarioRepository(); 
    this.cacheProvider = new CacheProvider();
  }
  

  async execute(userData) {
    if (!userData || Object.keys(userData).length === 0) {
      throw new Error('Dados de usuário inválidos');
    }

    // Verifica se o CPF já existe
    const usuarioExistente = await this.usuarioRepository.findByCPF(userData.cpf);
    if (usuarioExistente) {
      throw new Error('Usuário com esse CPF já existe');
    }

    const saltRounds = 10;
    userData.senhaHash = await bcrypt.hash(userData.senha, saltRounds);
    delete userData.senha; 

    const user = await this.usuarioRepository.create(userData);

    if (!user) {
      throw new Error('Falha ao criar usuário');
    }

    await this.cacheProvider.invalidate('users');

    return user;
  }
}

module.exports = CreateUsuarioUseCase;
