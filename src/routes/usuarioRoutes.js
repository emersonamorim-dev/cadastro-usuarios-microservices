const express = require('express');
const UsuarioController = require('@src/interfaces/controllers/UsuarioController');
const authMiddleware = require('@src/middlewares/authMiddleware');

const CreateUsuarioUseCase = require('@src/domain/usecases/CreateUsuarioUseCase');
const GetUsuarioUseCase = require('@src/domain/usecases/GetUsuarioUseCase');
const UpdateUsuarioUseCase = require('@src/domain/usecases/UpdateUsuarioUseCase');
const DeleteUsuarioUseCase = require('@src/domain/usecases/DeleteUsuarioUseCase');
const GetAllUsuariosUseCase = require('@src/domain/usecases/GetAllUsuariosUseCase');

const UsuarioRepository = require('@src/infrastructure/repositories/UsuarioRepository');
const CacheProvider = require('@src/infrastructure/cache/CacheProvider');

const usuarioRepository = new UsuarioRepository();
const cacheProvider = new CacheProvider(); 

// Instancia casos de uso, passando o repository e o cache provider quando necessário
const createUsuarioUseCase = new CreateUsuarioUseCase(usuarioRepository);
const getUsuarioUseCase = new GetUsuarioUseCase(usuarioRepository, cacheProvider);
const updateUsuarioUseCase = new UpdateUsuarioUseCase(usuarioRepository, cacheProvider);
const deleteUsuarioUseCase = new DeleteUsuarioUseCase(usuarioRepository);
const getAllUsuariosUseCase = new GetAllUsuariosUseCase(usuarioRepository, cacheProvider);

// Instancia o controlador
const usuarioController = new UsuarioController({
  createUsuario: createUsuarioUseCase,
  getUsuario: getUsuarioUseCase,
  updateUsuario: updateUsuarioUseCase,
  deleteUsuario: deleteUsuarioUseCase,
  getAllUsuarios: getAllUsuariosUseCase,
});

const router = express.Router();

// Rotas de usuários
router.post('/usuarios', authMiddleware, (req, res) => usuarioController.create(req, res));
router.get('/usuarios/:id', authMiddleware, (req, res) => usuarioController.getUsuario(req, res));
router.put('/usuarios/:id', authMiddleware, (req, res) => usuarioController.updateUsuario(req, res));
router.delete('/usuarios/:id', authMiddleware, (req, res) => usuarioController.deleteUsuario(req, res));
router.get('/usuarios', authMiddleware, (req, res) => usuarioController.getAllUsuarios(req, res));

module.exports = router;
