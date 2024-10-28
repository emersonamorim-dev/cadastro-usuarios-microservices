const UsuarioPresenter = require('../../../src/interfaces/presenters/UsuarioPresenter');

describe('UsuarioPresenter', () => {
  describe('present', () => {
    it('deve retornar um objeto formatado corretamente a partir de um usuário', () => {
      const mockUsuario = {
        id: '123',
        cpf: '12345678900',
        nome: 'Emerson Amorim',
        dataNascimento: '1981-01-01',
        endereco: {
          rua: 'Rua A',
          numero: '123',
          complemento: 'Apto 456',
          bairro: 'Bairro B',
          cidade: 'Cidade C',
          estado: 'SP',
          cep: '12345-678',
        },
        status: 'Ativo',
        createdAt: '2023-10-25T10:00:00.000Z',
        createdBy: 'admin',
        updatedAt: '2023-10-26T10:00:00.000Z',
        updatedBy: 'admin',
        deletedAt: null,
        deletedBy: null,
      };

      const result = UsuarioPresenter.present(mockUsuario);

      expect(result).toEqual({
        id: '123',
        cpf: '12345678900',
        nome: 'Emerson Amorim',
        dataNascimento: '1981-01-01',
        endereco: {
          rua: 'Rua A',
          numero: '123',
          complemento: 'Apto 456',
          bairro: 'Bairro B',
          cidade: 'Cidade C',
          estado: 'SP',
          cep: '12345-678',
        },
        status: 'Ativo',
        createdAt: '2023-10-25T10:00:00.000Z',
        createdBy: 'admin',
        updatedAt: '2023-10-26T10:00:00.000Z',
        updatedBy: 'admin',
        deletedAt: null,
        deletedBy: null,
      });
    });
  });

  describe('presentMany', () => {
    it('deve retornar um array de objetos formatados corretamente a partir de uma lista de usuários', () => {
      const mockUsuarios = [
        {
          id: '123',
          cpf: '12345678900',
          nome: 'Emerson Amorim',
          dataNascimento: '1981-01-01',
          endereco: {
            rua: 'Rua A',
            numero: '123',
            complemento: 'Apto 456',
            bairro: 'Bairro B',
            cidade: 'Cidade C',
            estado: 'SP',
            cep: '12345-678',
          },
          status: 'Ativo',
          createdAt: '2023-10-25T10:00:00.000Z',
          createdBy: 'admin',
          updatedAt: '2023-10-26T10:00:00.000Z',
          updatedBy: 'admin',
          deletedAt: null,
          deletedBy: null,
        },
        {
          id: '124',
          cpf: '98765432100',
          nome: 'Maria Silva',
          dataNascimento: '1990-05-20',
          endereco: {
            rua: 'Rua B',
            numero: '456',
            complemento: 'Casa',
            bairro: 'Bairro D',
            cidade: 'Cidade E',
            estado: 'RJ',
            cep: '98765-432',
          },
          status: 'Ativo',
          createdAt: '2023-10-24T10:00:00.000Z',
          createdBy: 'admin',
          updatedAt: '2023-10-25T10:00:00.000Z',
          updatedBy: 'admin',
          deletedAt: null,
          deletedBy: null,
        },
      ];

      const result = UsuarioPresenter.presentMany(mockUsuarios);

      expect(result).toEqual([
        {
          id: '123',
          cpf: '12345678900',
          nome: 'Emerson Amorim',
          dataNascimento: '1981-01-01',
          endereco: {
            rua: 'Rua A',
            numero: '123',
            complemento: 'Apto 456',
            bairro: 'Bairro B',
            cidade: 'Cidade C',
            estado: 'SP',
            cep: '12345-678',
          },
          status: 'Ativo',
          createdAt: '2023-10-25T10:00:00.000Z',
          createdBy: 'admin',
          updatedAt: '2023-10-26T10:00:00.000Z',
          updatedBy: 'admin',
          deletedAt: null,
          deletedBy: null,
        },
        {
          id: '124',
          cpf: '98765432100',
          nome: 'Maria Silva',
          dataNascimento: '1990-05-20',
          endereco: {
            rua: 'Rua B',
            numero: '456',
            complemento: 'Casa',
            bairro: 'Bairro D',
            cidade: 'Cidade E',
            estado: 'RJ',
            cep: '98765-432',
          },
          status: 'Ativo',
          createdAt: '2023-10-24T10:00:00.000Z',
          createdBy: 'admin',
          updatedAt: '2023-10-25T10:00:00.000Z',
          updatedBy: 'admin',
          deletedAt: null,
          deletedBy: null,
        },
      ]);
    });
  });
});
