const jwt = require('jsonwebtoken');
const UsuarioRepository = require('../../infrastructure/repositories/UsuarioRepository');
const bcrypt = require('bcrypt');
const config = require('../../../config');

class AuthController {
  constructor() {
    this.usuarioRepository = new UsuarioRepository();
  }

  async login(req, res) {
    try {
      const { cpf, password } = req.body;

      if (!cpf || !password) {
        return res.status(400).json({ error: 'CPF e senha são obrigatórios.' });
      }

      const usuario = await this.usuarioRepository.findByCPF(cpf);

      if (!usuario) {
        return res.status(401).json({ error: 'Credenciais inválidas.' });
      }

      const senhaValida = await bcrypt.compare(password, usuario.senhaHash);

      if (!senhaValida) {
        return res.status(401).json({ error: 'Credenciais inválidas.' });
      }

      // Gera o token JWT para o novo usuário com valor consistente para expiresIn
      const token = jwt.sign(
        { id: usuario.id, cpf: usuario.cpf },
        config.jwt.secret,
        { expiresIn: '1d' }
      );

      return res.status(200).json({
        token,
        user: {
          id: usuario.id,
          cpf: usuario.cpf,
          nome: usuario.nome
        }
      });
    } catch (error) {
      console.error('Erro ao processar a requisição:', error.message);
      return res.status(500).json({ error: 'Erro ao processar a requisição.' });
    }
  }

  async register(req, res) {
    try {
      const { cpf, nome, senha, endereco } = req.body;

      // Validações básicas
      if (!cpf || !nome || !senha) {
        return res.status(400).json({ error: 'CPF, nome e senha são obrigatórios.' });
      }

      if (
        !endereco ||
        !endereco.rua ||
        !endereco.numero ||
        !endereco.bairro ||
        !endereco.cidade ||
        !endereco.estado ||
        !endereco.cep
      ) {
        return res.status(400).json({ error: 'Todos os campos de endereço são obrigatórios.' });
      }

      // Verifica se o CPF já existe
      const usuarioExistente = await this.usuarioRepository.findByCPF(cpf);
      if (usuarioExistente) {
        return res.status(409).json({ error: 'Usuário com este CPF já existe.' });
      }

      // Criptografa a senha
      const senhaHash = await bcrypt.hash(senha, 10);
      const usuarioData = {
        cpf,
        nome,
        senhaHash,
        endereco,
        dataNascimento: req.body.dataNascimento || null,
        status: 'Ativo',
        createdBy: 'system'
      };

      const usuario = await this.usuarioRepository.create(usuarioData);

      // Gera o token JWT para o novo usuário com valor consistente para expiresIn
      const token = jwt.sign(
        { id: usuario.id, cpf: usuario.cpf },
        config.jwt.secret,
        { expiresIn: '1d' }
      );

      return res.status(201).json({
        message: 'Usuário registrado com sucesso.',
        token,
        user: {
          id: usuario.id,
          cpf: usuario.cpf,
          nome: usuario.nome
        }
      });
    } catch (error) {
      console.error('Erro ao registrar usuário:', error.message);
      return res.status(500).json({ error: 'Erro ao registrar o usuário.' });
    }
  }
}

module.exports = AuthController;

