class UsuarioPresenter {
  static present(usuario) {
    return {
      id: usuario.id,
      cpf: usuario.cpf,
      nome: usuario.nome,
      dataNascimento: usuario.dataNascimento,
      endereco: {
        rua: usuario.endereco.rua,
        numero: usuario.endereco.numero,
        complemento: usuario.endereco.complemento,
        bairro: usuario.endereco.bairro,
        cidade: usuario.endereco.cidade,
        estado: usuario.endereco.estado,
        cep: usuario.endereco.cep,
      },
      status: usuario.status,
      createdAt: usuario.createdAt,
      createdBy: usuario.createdBy,
      updatedAt: usuario.updatedAt,
      updatedBy: usuario.updatedBy,
      deletedAt: usuario.deletedAt,
      deletedBy: usuario.deletedBy,
    };
  }

  static presentMany(usuarios) {
    return usuarios.map((usuario) => this.present(usuario));
  }
}

module.exports = UsuarioPresenter;

  