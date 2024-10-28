class Usuario {
    constructor({
      id,
      nome,
      cpf,
      dataNascimento,
      endereco,
      status = 'Ativo',
      createdAt,
      createdBy,
      updatedAt,
      updatedBy,
      deletedAt,
      deletedBy,
    }) {
      this.id = id;
      this.nome = nome;
      this.cpf = cpf;
      this.dataNascimento = dataNascimento;
      this.endereco = endereco;
      this.status = status;
      this.createdAt = createdAt;
      this.createdBy = createdBy;
      this.updatedAt = updatedAt;
      this.updatedBy = updatedBy;
      this.deletedAt = deletedAt;
      this.deletedBy = deletedBy;
    }
  }
  
  module.exports = Usuario;
  