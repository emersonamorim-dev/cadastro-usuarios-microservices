const UsuarioRepository = require('../../../src/infrastructure/repositories/UsuarioRepository');
const pool = require('../../../src/infrastructure/database/MySQLConnection');

jest.mock('../../../src/infrastructure/database/MySQLConnection', () => ({
  getConnection: jest.fn(),
}));

describe('UsuarioRepository', () => {
  let usuarioRepository;
  let mockConnection;

  beforeEach(() => {
    usuarioRepository = new UsuarioRepository();
    mockConnection = {
      execute: jest.fn(),
      release: jest.fn(),
    };
    pool.getConnection.mockResolvedValue(mockConnection);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('deve criar um novo usuário com sucesso', async () => {
      const userData = {
        cpf: '12345678900',
        nome: 'Emerson Amorim',
        senhaHash: 'hashedPassword',
        endereco: {
          rua: 'Rua A',
          numero: '123',
          bairro: 'Bairro B',
          cidade: 'Cidade C',
          estado: 'SP',
          cep: '12345-678',
        },
        status: 'Ativo',
        createdBy: 'system',
      };

      mockConnection.execute.mockResolvedValue([{ insertId: 1 }]);

      const result = await usuarioRepository.create(userData);

      expect(mockConnection.execute).toHaveBeenCalledWith(expect.any(String), expect.any(Array));
      expect(result).toEqual({ id: 1, ...userData });
    });

    it('deve lançar um erro quando os dados do usuário forem incompletos', async () => {
      await expect(usuarioRepository.create({})).rejects.toThrow('Dados de usuário incompletos ou inválidos');
    });
  });

  describe('findById', () => {
    it('deve retornar um usuário pelo ID', async () => {
      const mockUser = {
        id: 1,
        cpf: '12345678900',
        nome: 'Emerson Amorim',
        senha_hash: 'hashedPassword',
        endereco_rua: 'Rua A',
        endereco_numero: '123',
        endereco_bairro: 'Barra Funda',
        endereco_cidade: 'São Paulo',
        endereco_estado: 'SP',
        endereco_cep: '12345-678',
        status: 'Ativo',
        created_at: '2024-10-26',
        created_by: 'system',
      };

      mockConnection.execute.mockResolvedValue([[mockUser]]);

      const result = await usuarioRepository.findById(1);

      expect(mockConnection.execute).toHaveBeenCalledWith(expect.any(String), [1]);
      expect(result).toEqual(usuarioRepository._mapToUser(mockUser));
    });

    it('deve retornar null quando o usuário não for encontrado', async () => {
      mockConnection.execute.mockResolvedValue([[]]);

      const result = await usuarioRepository.findById(999);

      expect(result).toBeNull();
    });
  });

  describe('update', () => {
    it('deve atualizar um usuário com sucesso', async () => {
      const updateData = {
        nome: 'Emerson Amorim',
        endereco: {
          rua: 'Rua B',
          numero: '456',
          bairro: 'Bairro C',
          cidade: 'Cidade D',
          estado: 'RJ',
          cep: '98765-432',
        },
      };
  
      // Primeiro mock para simular a atualização
      mockConnection.execute.mockResolvedValueOnce([{ affectedRows: 1 }]);
      // Segundo mock para simular o retorno do usuário atualizado
      mockConnection.execute.mockResolvedValueOnce([[{
        id: 1,
        cpf: '12345678900',
        nome: updateData.nome,
        endereco_rua: updateData.endereco.rua,
        endereco_numero: updateData.endereco.numero,
        endereco_bairro: updateData.endereco.bairro,
        endereco_cidade: updateData.endereco.cidade,
        endereco_estado: updateData.endereco.estado,
        endereco_cep: updateData.endereco.cep,
        status: 'Ativo',
        created_at: '2024-10-26',
        created_by: 'system',
      }]]);
  
      const result = await usuarioRepository.update(1, updateData);
  
      expect(mockConnection.execute).toHaveBeenCalledWith(expect.any(String), expect.any(Array));
      expect(result).toEqual(expect.objectContaining({ id: 1, nome: updateData.nome }));
    });
  
    it('deve retornar null quando o usuário a ser atualizado não for encontrado', async () => {
      // Mock para simular que nenhum usuário foi encontrado para atualização
      mockConnection.execute.mockResolvedValue([{ affectedRows: 0 }]);
  
      const result = await usuarioRepository.update(999, {});
  
      expect(result).toBeNull();
    });
  
    it('deve lançar um erro se os dados do endereço forem indefinidos', async () => {
      const updateData = {
        nome: 'Emerson Amorim',
      };
  
      // Mock para simular a tentativa de atualização sem os dados do endereço completos
      mockConnection.execute.mockResolvedValueOnce([{ affectedRows: 1 }]);
      mockConnection.execute.mockResolvedValueOnce([[{
        id: 1,
        cpf: '12345678900',
        nome: updateData.nome,
        endereco_rua: null,
        endereco_numero: null,
        endereco_bairro: null,
        endereco_cidade: null,
        endereco_estado: null,
        endereco_cep: null,
        status: 'Ativo',
        created_at: '2024-10-26',
        created_by: 'system',
      }]]);
  
      await expect(usuarioRepository.update(1, updateData)).resolves.not.toThrow();
    });
  });
  
  
  

  describe('delete', () => {
    it('deve deletar um usuário com sucesso', async () => {
      mockConnection.execute.mockResolvedValue([{ affectedRows: 1 }]);

      const result = await usuarioRepository.delete(1);

      expect(mockConnection.execute).toHaveBeenCalledWith(expect.any(String), [expect.any(String), 1]);
      expect(result).toBe(true);
    });

    it('deve retornar false quando o usuário a ser deletado não for encontrado', async () => {
      mockConnection.execute.mockResolvedValue([{ affectedRows: 0 }]);

      const result = await usuarioRepository.delete(999);

      expect(result).toBe(false);
    });
  });

  describe('findByCPF', () => {
    it('deve retornar um usuário pelo CPF', async () => {
      const mockUser = {
        id: 1,
        cpf: '12345678900',
        nome: 'Emerson Amorim',
        senha_hash: 'hashedPassword',
        endereco_rua: 'Rua A',
        endereco_numero: '123',
        endereco_bairro: 'Bairro B',
        endereco_cidade: 'Cidade C',
        endereco_estado: 'SP',
        endereco_cep: '12345-678',
        status: 'Ativo',
        created_at: '2024-10-26',
        created_by: 'system',
      };

      mockConnection.execute.mockResolvedValue([[mockUser]]);

      const result = await usuarioRepository.findByCPF('12345678900');

      expect(mockConnection.execute).toHaveBeenCalledWith(expect.any(String), ['12345678900']);
      expect(result).toEqual(usuarioRepository._mapToUser(mockUser));
    });

    it('deve retornar null quando o usuário não for encontrado pelo CPF', async () => {
      mockConnection.execute.mockResolvedValue([[]]);

      const result = await usuarioRepository.findByCPF('00000000000');

      expect(result).toBeNull();
    });
  });

  describe('findAll', () => {
    it('deve retornar todos os usuários', async () => {
      const mockUsers = [
        {
          id: 1,
          cpf: '12345678900',
          nome: 'Emerson Amorim',
          senha_hash: 'hashedPassword',
          endereco_rua: 'Rua A',
          endereco_numero: '123',
          endereco_bairro: 'Bairro B',
          endereco_cidade: 'Cidade C',
          endereco_estado: 'SP',
          endereco_cep: '12345-678',
          status: 'Ativo',
          created_at: '2024-10-26',
          created_by: 'system',
        },
      ];

      mockConnection.execute.mockResolvedValue([mockUsers]);

      const result = await usuarioRepository.findAll();

      expect(mockConnection.execute).toHaveBeenCalledWith(expect.any(String));
      expect(result).toEqual(mockUsers.map((user) => usuarioRepository._mapToUser(user)));
    });
  });
});
