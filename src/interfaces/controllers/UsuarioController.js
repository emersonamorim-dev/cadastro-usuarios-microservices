const UsuarioPresenter = require('../presenters/UsuarioPresenter');
const UsuarioRepository = require('../../infrastructure/repositories/UsuarioRepository');
const GetUsuarioUseCase = require('../../domain/usecases/GetUsuarioUseCase');
const UpdateUsuarioUseCase = require('../../domain/usecases/UpdateUsuarioUseCase');
const DeleteUsuarioUseCase = require('../../domain/usecases/DeleteUsuarioUseCase');
const GetAllUsuariosUseCase = require('../../domain/usecases/GetAllUsuariosUseCase');

class UsuarioController {
  constructor() {
    // Instancia UsuarioRepository e usar em todos os casos de uso
    const usuarioRepository = new UsuarioRepository();
    
    this.getUsuarioUseCase = new GetUsuarioUseCase(usuarioRepository);
    this.updateUsuarioUseCase = new UpdateUsuarioUseCase(usuarioRepository);
    this.deleteUsuarioUseCase = new DeleteUsuarioUseCase(usuarioRepository);
    this.getAllUsuariosUseCase = new GetAllUsuariosUseCase(usuarioRepository);
  }

  async getUsuario(req, res) {
    try {
      const usuarioId = req.params.id;

      const usuario = await this.getUsuarioUseCase.execute(usuarioId);

      if (!usuario) {
        return res.status(404).json({ error: 'Usuário não encontrado.' });
      }

      const presentedUsuario = UsuarioPresenter.present(usuario);

      return res.status(200).json({ user: presentedUsuario });
    } catch (error) {
      console.error('Erro ao buscar usuário:', error.message);
      return res.status(400).json({ error: error.message });
    }
  }

  async updateUsuario(req, res) {
    try {
      const usuarioId = req.params.id;
      const updateData = req.body;
      const updatedBy = req.user ? req.user.id : 'system';

      const usuario = await this.updateUsuarioUseCase.execute(usuarioId, {
        ...updateData,
        updatedBy,
      });

      if (!usuario) {
        return res.status(404).json({ error: 'Usuário não encontrado ou não pôde ser atualizado.' });
      }

      const presentedUsuario = UsuarioPresenter.present(usuario);

      return res.status(200).json({ user: presentedUsuario });
    } catch (error) {
      console.error('Erro ao atualizar usuário:', error.message);
      return res.status(400).json({ error: error.message });
    }
  }

  async deleteUsuario(req, res) {
    try {
      const usuarioId = req.params.id;
      const deletedBy = req.user ? req.user.id : 'system';

      const success = await this.deleteUsuarioUseCase.execute(usuarioId, deletedBy);

      if (!success) {
        return res.status(404).json({ error: 'Usuário não encontrado ou não pôde ser removido.' });
      }

      return res.status(200).json({ message: 'Usuário removido com sucesso.' });
    } catch (error) {
      console.error('Erro ao remover usuário:', error.message);
      return res.status(400).json({ error: error.message });
    }
  }

  async getAllUsuarios(req, res) {
    try {
      const usuarios = await this.getAllUsuariosUseCase.execute();

      const presentedUsuarios = UsuarioPresenter.presentMany(usuarios);

      return res.status(200).json({ users: presentedUsuarios });
    } catch (error) {
      console.error('Erro ao buscar todos os usuários:', error.message);
      return res.status(400).json({ error: error.message });
    }
  }
}

module.exports = UsuarioController;
