const UsuarioController = require('../../../src/interfaces/controllers/UsuarioController');
const UsuarioPresenter = require('../../../src/interfaces/presenters/UsuarioPresenter');
const GetUsuarioUseCase = require('../../../src/domain/usecases/GetUsuarioUseCase');
const UpdateUsuarioUseCase = require('../../../src/domain/usecases/UpdateUsuarioUseCase');
const DeleteUsuarioUseCase = require('../../../src/domain/usecases/DeleteUsuarioUseCase');
const GetAllUsuariosUseCase = require('../../../src/domain/usecases/GetAllUsuariosUseCase');

// Mock os casos de uso
jest.mock('../../../src/domain/usecases/GetUsuarioUseCase');
jest.mock('../../../src/domain/usecases/UpdateUsuarioUseCase');
jest.mock('../../../src/domain/usecases/DeleteUsuarioUseCase');
jest.mock('../../../src/domain/usecases/GetAllUsuariosUseCase');

describe('UsuarioController', () => {
  let usuarioController;
  let mockReq;
  let mockRes;
  let consoleErrorSpy;

  beforeEach(() => {
    // Mock os casos de uso individualmente
    GetUsuarioUseCase.mockImplementation(() => ({
      execute: jest.fn(),
    }));
    UpdateUsuarioUseCase.mockImplementation(() => ({
      execute: jest.fn(),
    }));
    DeleteUsuarioUseCase.mockImplementation(() => ({
      execute: jest.fn(),
    }));
    GetAllUsuariosUseCase.mockImplementation(() => ({
      execute: jest.fn(),
    }));

    usuarioController = new UsuarioController();

    // Mock req e res para os testes
    mockReq = {
      params: {},
      body: {},
      user: {},
    };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.clearAllMocks();
    consoleErrorSpy.mockRestore(); 
  });

  describe('getUsuario', () => {
    it('deve retornar 200 e os dados do usuário quando encontrado', async () => {
      const mockUsuario = { id: '123', nome: 'Emerson Amorim', cpf: '123456789' };
      mockReq.params.id = '123';

      // Simula retorno do caso de uso
      usuarioController.getUsuarioUseCase.execute.mockResolvedValue(mockUsuario);

      // Simula apresentação dos dados
      jest.spyOn(UsuarioPresenter, 'present').mockReturnValue(mockUsuario);

      await usuarioController.getUsuario(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({ user: mockUsuario });
    });

    it('deve retornar 404 quando o usuário não for encontrado', async () => {
      mockReq.params.id = '123';

      // Simula retorno do caso de uso como nulo
      usuarioController.getUsuarioUseCase.execute.mockResolvedValue(null);

      await usuarioController.getUsuario(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'Usuário não encontrado.' });
    });

    it('deve retornar 400 e uma mensagem de erro em caso de exceção', async () => {
      mockReq.params.id = '123';

      // Simula uma exceção sendo lançada pelo caso de uso
      usuarioController.getUsuarioUseCase.execute.mockRejectedValue(new Error('Erro inesperado'));

      await usuarioController.getUsuario(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'Erro inesperado' });
    });
  });

  describe('updateUsuario', () => {
    it('deve retornar 200 e o usuário atualizado quando a atualização for bem-sucedida', async () => {
      const mockUsuarioAtualizado = { id: '123', nome: 'Emerson Amorim', cpf: '123456789' };
      mockReq.params.id = '123';
      mockReq.body = { nome: 'Emerson Amorim' };
      mockReq.user.id = 'system';

      usuarioController.updateUsuarioUseCase.execute.mockResolvedValue(mockUsuarioAtualizado);

      jest.spyOn(UsuarioPresenter, 'present').mockReturnValue(mockUsuarioAtualizado);

      await usuarioController.updateUsuario(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({ user: mockUsuarioAtualizado });
    });

    it('deve retornar 404 quando o usuário não for encontrado', async () => {
      mockReq.params.id = '123';
      mockReq.body = { nome: 'Emerson Amorim' };

      usuarioController.updateUsuarioUseCase.execute.mockResolvedValue(null);

      await usuarioController.updateUsuario(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'Usuário não encontrado ou não pôde ser atualizado.' });
    });

    it('deve retornar 400 e uma mensagem de erro em caso de exceção', async () => {
      mockReq.params.id = '123';
      mockReq.body = { nome: 'Emerson Amorim' };

      usuarioController.updateUsuarioUseCase.execute.mockRejectedValue(new Error('Erro inesperado'));

      await usuarioController.updateUsuario(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'Erro inesperado' });
    });
  });

  describe('deleteUsuario', () => {
    it('deve retornar 200 quando o usuário for removido com sucesso', async () => {
      mockReq.params.id = '123';
      mockReq.user.id = 'system';

      usuarioController.deleteUsuarioUseCase.execute.mockResolvedValue(true);

      await usuarioController.deleteUsuario(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'Usuário removido com sucesso.' });
    });

    it('deve retornar 404 quando o usuário não for encontrado ou não puder ser removido', async () => {
      mockReq.params.id = '123';

      usuarioController.deleteUsuarioUseCase.execute.mockResolvedValue(false);

      await usuarioController.deleteUsuario(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'Usuário não encontrado ou não pôde ser removido.' });
    });

    it('deve retornar 400 e uma mensagem de erro em caso de exceção', async () => {
      mockReq.params.id = '123';

      usuarioController.deleteUsuarioUseCase.execute.mockRejectedValue(new Error('Erro inesperado'));

      await usuarioController.deleteUsuario(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'Erro inesperado' });
    });
  });

  describe('getAllUsuarios', () => {
    it('deve retornar 200 e a lista de usuários', async () => {
      const mockUsuarios = [
        { id: '123', nome: 'Emerson Amorim', cpf: '123456789' },
        { id: '456', nome: 'Emerson Amorim', cpf: '987654321' },
      ];

      usuarioController.getAllUsuariosUseCase.execute.mockResolvedValue(mockUsuarios);

      jest.spyOn(UsuarioPresenter, 'presentMany').mockReturnValue(mockUsuarios);

      await usuarioController.getAllUsuarios(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({ users: mockUsuarios });
    });

    it('deve retornar 400 e uma mensagem de erro em caso de exceção', async () => {
      usuarioController.getAllUsuariosUseCase.execute.mockRejectedValue(new Error('Erro inesperado'));

      await usuarioController.getAllUsuarios(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'Erro inesperado' });
    });
  });
});
